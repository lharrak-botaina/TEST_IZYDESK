<?php
namespace App\Controller;

use App\Entity\Categorie;
use App\Repository\CategorieRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/categories', name: 'api_categories_')]
class CategorieController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(CategorieRepository $categorieRepository, SerializerInterface $serializer): JsonResponse
    {
        $categories = $categorieRepository->findAll();
        $json = $serializer->serialize($categories, 'json', ['groups' => 'categorie:read']);
        return new JsonResponse($json, 200, [], true);
    }

   

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(CategorieRepository $categorieRepository, int $id): JsonResponse
    {
        $categorie = $categorieRepository->find($id);

        if (!$categorie) {
            return $this->json(['message' => 'Catégorie non trouvée'], 404);
        }

        return $this->json($categorie, 200, [], ['groups' => 'categorie:read']);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['nom'])) {
            return $this->json(['message' => 'Nom de la catégorie requis'], 400);
        }

        $categorie = new Categorie();
        $categorie->setNom($data['nom']);

        $entityManager->persist($categorie);
        $entityManager->flush();

        return $this->json(['message' => 'Catégorie créée avec succès'], 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(CategorieRepository $categorieRepository, EntityManagerInterface $entityManager, Request $request, int $id): JsonResponse
    {
        $categorie = $categorieRepository->find($id);

        if (!$categorie) {
            return $this->json(['message' => 'Catégorie non trouvée'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['nom'])) {
            $categorie->setNom($data['nom']);
        }

        $entityManager->persist($categorie);
        $entityManager->flush();

        return $this->json(['message' => 'Catégorie mise à jour avec succès'], 200);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(CategorieRepository $categorieRepository, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $categorie = $categorieRepository->find($id);

        if (!$categorie) {
            return $this->json(['message' => 'Catégorie non trouvée'], 404);
        }

        $entityManager->remove($categorie);
        $entityManager->flush();

        return $this->json(['message' => 'Catégorie supprimée avec succès'], 200);
    }
}

