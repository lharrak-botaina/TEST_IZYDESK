<?php
namespace App\Controller;

use App\Entity\Categorie;
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
    #[Route('', name: 'list', methods: ['GET'])]
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
    #[Route('', name: 'create', methods: ['POST'])]
    // #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            // Retrieve text fields
            $data = $request->request->all();
            $imageFile = $request->files->get('image'); // Get uploaded file

            // Validate required fields
            if (!isset($data['nom'], $data['description'], $data['prix'], $data['categorie_id']) || !$imageFile) {
                return $this->json(['message' => 'Données manquantes'], 400);
            }

            // Validate price
            if (!is_numeric($data['prix']) || $data['prix'] < 0) {
                return $this->json(['message' => 'Prix invalide'], 400);
            }

            // Retrieve category
            $categorie = $entityManager->getRepository(Categorie::class)->find($data['categorie_id']);
            if (!$categorie) {
                return $this->json(['message' => 'Catégorie non trouvée'], 404);
            }

            // Handle file upload (save to 'uploads/' directory)
            $uploadsDir = $this->getParameter('kernel.project_dir') . '/public/uploads/';
            $imageFileName = uniqid() . '.' . $imageFile->getClientOriginalExtension(); // Fixed extension guessing

            if (!is_dir($uploadsDir)) {
                mkdir($uploadsDir, 0777, true);
            }

            $imageFile->move($uploadsDir, $imageFileName);
            $imagePath = '/uploads/' . $imageFileName;

            // Create new product
            $produit = new Produit();
            $produit->setNom($data['nom']);
            $produit->setDescription($data['description']);
            $produit->setPrix((float) $data['prix']);
            $produit->setImage($imagePath);
            $produit->setCategorie($categorie);

            // Save to database
            $entityManager->persist($produit);
            $entityManager->flush();

            return $this->json([
                'message' => 'Produit créé avec succès',
                'id' => $produit->getId(),
                'image' => $request->getSchemeAndHttpHost() . $imagePath

            ], 201);

        } catch (\Exception $e) {
            return $this->json([
                'message' => 'Erreur interne',
                'error' => $e->getMessage()
            ], 500);
        }
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
