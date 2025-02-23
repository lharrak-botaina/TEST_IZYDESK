<?php
namespace App\Controller;

use App\Entity\Commande;
use App\Entity\CommandeProduit;
use App\Repository\CommandeRepository;
use App\Repository\ProduitRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/commandes', name: 'api_commandes_')]
class CommandeController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * Get all commandes (optional: filter by status)
     */
    #[Route('/', name: 'list', methods: ['GET'])]
    public function list(CommandeRepository $commandeRepository, Request $request): JsonResponse
    {
        $status = $request->query->get('status');

        if ($status) {
            if (!in_array($status, ["Pending", "Shipped", "Delivered", "Canceled"], true)) {
                return $this->json(['message' => "Invalid status: $status. Allowed statuses: Pending, Shipped, Delivered, Canceled"], Response::HTTP_BAD_REQUEST);
            }
            $commandes = $commandeRepository->findBy(['status' => $status]);
        } else {
            $commandes = $commandeRepository->findAll();
        }

        if (empty($commandes)) {
            return $this->json(['message' => 'No orders found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($commandes, Response::HTTP_OK, [], ['groups' => 'commande:read']);
    }

    /**
     * Get a single commande by ID
     */
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(CommandeRepository $commandeRepository, int $id): JsonResponse
    {
        $commande = $commandeRepository->find($id);

        if (!$commande) {
            return $this->json(['message' => 'Commande non trouvée'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($commande, Response::HTTP_OK, [], ['groups' => 'commande:read']);
    }

    /**
     * Create a new commande
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, ProduitRepository $produitRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['produits']) || empty($data['produits'])) {
            return $this->json(['message' => 'Aucun produit sélectionné'], Response::HTTP_BAD_REQUEST);
        }

        $commande = new Commande();

        // Set default status or validate provided status
        if (isset($data['status'])) {
            try {
                $commande->setStatus($data['status']);
            } catch (\InvalidArgumentException $e) {
                return $this->json(['message' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
            }
        } else {
            $commande->setStatus("Pending"); // Default status
        }

        $this->entityManager->persist($commande);

        foreach ($data['produits'] as $produitData) {
            $produit = $produitRepository->find($produitData['id']);

            if (!$produit) {
                return $this->json(['message' => "Produit ID {$produitData['id']} non trouvé"], Response::HTTP_NOT_FOUND);
            }

            $commandeProduit = new CommandeProduit();
            $commandeProduit->setCommande($commande);
            $commandeProduit->setProduit($produit);
            $commandeProduit->setQuantite($produitData['quantite'] ?? 1); // Default quantity = 1

            $this->entityManager->persist($commandeProduit);
        }

        $this->entityManager->flush();

        return $this->json([
            'message' => 'Commande créée avec succès',
            'id' => $commande->getId(),
            'status' => $commande->getStatus()
        ], Response::HTTP_CREATED);
    }

    /**
     * Update a commande (change status)
     */
    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(Request $request, CommandeRepository $commandeRepository, int $id): JsonResponse
    {
        $commande = $commandeRepository->find($id);
        if (!$commande) {
            return $this->json(['message' => 'Commande non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['status'])) {
            try {
                $commande->setStatus($data['status']);
            } catch (\InvalidArgumentException $e) {
                return $this->json(['message' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
            }
        }

        $this->entityManager->flush();

        return $this->json([
            'message' => 'Commande mise à jour avec succès',
            'status' => $commande->getStatus()
        ], Response::HTTP_OK);
    }

    /**
     * Delete a commande
     */
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(CommandeRepository $commandeRepository, int $id): JsonResponse
    {
        $commande = $commandeRepository->find($id);

        if (!$commande) {
            return $this->json(['message' => 'Commande non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($commande);
        $this->entityManager->flush();

        return $this->json(['message' => 'Commande supprimée avec succès'], Response::HTTP_OK);
    }
}
