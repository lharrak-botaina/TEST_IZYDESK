<?php

namespace App\Controller;

use Stripe\Stripe;
use Stripe\Checkout\Session;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class PaymentController extends AbstractController
{
    #[Route('/payment/create-session', name: 'stripe_create_session', methods: ['POST'])]
    public function createSession(Request $request): JsonResponse
    {
        Stripe::setApiKey($this->getParameter('stripe.secret_key'));

        $data = json_decode($request->getContent(), true);

        // Validate input
        if (!isset($data['product_name']) || !isset($data['amount']) || $data['amount'] <= 0) {
            return $this->json(['error' => 'Invalid product name or amount'], 400);
        }

        $lineItems = [
            [
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => $data['product_name']
                    ],
                    'unit_amount' => $data['amount'] * 100
                ],
                'quantity' => 1
            ]
        ];

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => $this->generateUrl('payment_success', [], UrlGeneratorInterface::ABSOLUTE_URL),
            'cancel_url' => $this->generateUrl('payment_cancel', [], UrlGeneratorInterface::ABSOLUTE_URL),
        ]);

        return $this->json(['id' => $session->id, 'url' => $session->url]);
    }

    #[Route('/payment/success', name: 'payment_success')]
    public function paymentSuccess()
    {
        return $this->render('payment/success.html.twig');
    }

    #[Route('/payment/cancel', name: 'payment_cancel')]
    public function paymentCancel()
    {
        return $this->render('payment/cancel.html.twig');
    }
}
