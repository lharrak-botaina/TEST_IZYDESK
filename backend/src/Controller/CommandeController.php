<?php
namespace App\Controller;

use App\Entity\Commande;
use App\Repository\CommandeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/commandes', name: 'api_commandes_')]
class CommandeController extends AbstractController
{
    #[Route('/', name: 'list', methods: ['GET'])]
    public function list(CommandeRepository $commandeRepository): JsonResponse
    {
        $commandes = $commandeRepository->findAll();

        if (empty($commandes)) {
            return $this->json(['message' => 'Aucune commande trouvée'], 404);
        }

        return $this->json($commandes, 200, [], ['groups' => 'commande:read']);
    }
}
