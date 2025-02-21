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
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/commandes', name: 'api_commandes_')]
class CommandeController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/', name: 'list', methods: ['GET'])]
    public function list(CommandeRepository $commandeRepository, Request $request): JsonResponse
    {
        $status = $request->query->get('status');

        if ($status) {
            $validStatuses = [Commande::STATUS_PENDING, Commande::STATUS_DISPATCHED, Commande::STATUS_DELIVERED, Commande::STATUS_CANCELED];

            if (!in_array($status, $validStatuses, true)) {
                return $this->json(['message' => "Invalid status: $status. Allowed statuses: " . implode(", ", $validStatuses)], 400);
            }

            $commandes = $commandeRepository->findBy(['status' => $status]);
        } else {
            $commandes = $commandeRepository->findAll();
        }

        if (empty($commandes)) {
            return $this->json(['message' => 'No orders found'], 404);
        }

        return $this->json($commandes, 200, [], ['groups' => 'commande:read']);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(CommandeRepository $commandeRepository, int $id): JsonResponse
    {
        $commande = $commandeRepository->find($id);

        if (!$commande) {
            return $this->json(['message' => 'Commande non trouvée'], 404);
        }

        return $this->json($commande, 200, [], ['groups' => 'commande:read']);
    }

    #[Route('/', name: 'create', methods: ['POST'])]
    public function create(Request $request, ProduitRepository $produitRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['produits']) || empty($data['produits'])) {
            return $this->json(['message' => 'Aucun produit sélectionné'], 400);
        }

        $commande = new Commande();
        $this->entityManager->persist($commande);

        foreach ($data['produits'] as $produitData) {
            $produit = $produitRepository->find($produitData['id']);

            if (!$produit) {
                return $this->json(['message' => "Produit ID {$produitData['id']} non trouvé"], 404);
            }

            $commandeProduit = new CommandeProduit();
            $commandeProduit->setCommande($commande);
            $commandeProduit->setProduit($produit);
            $commandeProduit->setQuantite($produitData['quantite'] ?? 1);

            $this->entityManager->persist($commandeProduit);
        }

        $this->entityManager->flush();

        return $this->json([
            'message' => 'Commande créée avec succès',
            'id' => $commande->getId(),
            'status' => $commande->getStatus()
        ], 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(Request $request, CommandeRepository $commandeRepository, int $id): JsonResponse
    {
        $commande = $commandeRepository->find($id);
        if (!$commande) {
            return $this->json(['message' => 'Commande non trouvée'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['status'])) {
            try {
                $commande->setStatus($data['status']);
            } catch (\InvalidArgumentException $e) {
                return $this->json(['message' => $e->getMessage()], 400);
            }
        }

        $this->entityManager->flush();

        return $this->json([
            'message' => 'Commande mise à jour avec succès',
            'status' => $commande->getStatus()
        ], 200);
    }


    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(CommandeRepository $commandeRepository, int $id): JsonResponse
    {
        $commande = $commandeRepository->find($id);

        if (!$commande) {
            return $this->json(['message' => 'Commande non trouvée'], 404);
        }

        $this->entityManager->remove($commande);
        $this->entityManager->flush();

        return $this->json(['message' => 'Commande supprimée avec succès'], 200);
    }
}
