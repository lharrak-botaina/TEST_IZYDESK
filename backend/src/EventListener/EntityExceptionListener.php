<?php
namespace App\EventListener;

use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class EntityExceptionListener
{
    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function onKernelException(ExceptionEvent $event)
    {
        $exception = $event->getThrowable();

        // Log pour vérifier que le listener est bien exécuté
        $this->logger->error('Exception capturée : ' . $exception->getMessage());

        if ($exception instanceof ForeignKeyConstraintViolationException) {
            $this->logger->error('Violation de contrainte d’intégrité détectée !');

            $response = new JsonResponse([
                'message' => 'Impossible de supprimer cet élément car il est utilisé ailleurs.'
            ], 400);

            $event->setResponse($response);
            return;
        }

        if ($exception instanceof HttpExceptionInterface) {
            $response = new JsonResponse([
                'message' => $exception->getMessage()
            ], $exception->getStatusCode());
        } else {
            $response = new JsonResponse([
                'message' => 'Une erreur interne est survenue.'
            ], 500);
        }

        $event->setResponse($response);
    }
}
