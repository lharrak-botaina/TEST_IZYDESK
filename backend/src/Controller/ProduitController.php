<?php
namespace App\Controller;

use App\Entity\Produit;
use App\Repository\ProduitRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api/produits', name: 'api_produits_')]
class ProduitController extends AbstractController
{
    #[Route('/', name: 'list', methods: ['GET'])]
    public function list(ProduitRepository $produitRepository, SerializerInterface $serializer): JsonResponse
    {
        $produits = $produitRepository->findAll();

        // Vérifier les données
        if (empty($produits)) {
            return $this->json(['message' => 'Aucun produit trouvé'], 404);
        }

        // Sérialiser avec le groupe "produit:read"
        $json = $serializer->serialize($produits, 'json', ['groups' => 'produit:read']);

        return new JsonResponse($json, 200, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(ProduitRepository $produitRepository, int $id): JsonResponse
    {
        $produit = $produitRepository->find($id);

        if (!$produit) {
            return $this->json(['message' => 'Produit non trouvé'], 404);
        }

        return $this->json($produit, 200, [], ['groups' => 'produit:read']);
    }


    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(ProduitRepository $produitRepository, EntityManagerInterface $entityManager, Request $request, int $id): JsonResponse
    {
        $produit = $produitRepository->find($id);

        if (!$produit) {
            return $this->json(['message' => 'Produit non trouvé'], 404);
        }

        // Récupérer les données envoyées
        $data = json_decode($request->getContent(), true);

        if (isset($data['nom'])) {
            $produit->setNom($data['nom']);
        }
        if (isset($data['description'])) {
            $produit->setDescription($data['description']);
        }
        if (isset($data['prix'])) {
            $produit->setPrix($data['prix']);
        }
        if (isset($data['image'])) {
            $produit->setImage($data['image']);
        }

        $entityManager->persist($produit);
        $entityManager->flush();

        return $this->json(['message' => 'Produit mis à jour avec succès'], 200);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(ProduitRepository $produitRepository, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $produit = $produitRepository->find($id);

        if (!$produit) {
            return $this->json(['message' => 'Produit non trouvé'], 404);
        }

        $entityManager->remove($produit);
        $entityManager->flush();

        return $this->json(['message' => 'Produit supprimé avec succès'], 200);
    }



}
