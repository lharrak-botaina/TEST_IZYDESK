<?php
namespace App\DataFixtures;

use App\Entity\Categorie;
use App\Entity\Produit;
use App\Entity\Commande;
use App\Entity\CommandeProduit;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Possible statuses for orders
        $statuses = ["Pending", "Shipped", "Delivered", "Canceled"];

        // Creating categories for plants
        $categories = [];

        $categoryNames = ["Indoor Plants", "Outdoor Plants", "Succulents", "Flowering Plants"];
        foreach ($categoryNames as $name) {
            $categorie = new Categorie();
            $categorie->setNom($name);
            $manager->persist($categorie);
            $categories[] = $categorie;
        }

        // Realistic plant products with images, descriptions, and prices
        $plantsData = [
           
            [
                "name" => "Bird of Paradise",
                "description" => "A stunning tropical plant with broad leaves, perfect for bright indoor spaces.",
                "price" => 59.99,
                "image" => "uploads/product2.jpg",
                "category" => $categories[0] // Indoor Plants
            ],
            [
                "name" => "Aloe Vera",
                "description" => "A succulent plant known for its healing properties and easy maintenance.",
                "price" => 19.99,
                "image" => "uploads/product3.jpg",
                "category" => $categories[2] // Succulents
            ],
            [
                "name" => "Jasmine Plant",
                "description" => "A fragrant flowering plant that produces beautiful white blossoms.",
                "price" => 29.99,
                "image" => "uploads/product4.jpg",
                "category" => $categories[3] // Flowering Plants
            ],
            [
                "name" => "Snake Plant",
                "description" => "An air-purifying indoor plant that requires minimal care and thrives in low light.",
                "price" => 24.99,
                "image" => "uploads/product5.jpg",
                "category" => $categories[0] // Indoor Plants
            ]
        ];

        $produits = [];
        foreach ($plantsData as $plant) {
            $produit = new Produit();
            $produit->setNom($plant["name"]);
            $produit->setDescription($plant["description"]);
            $produit->setPrix($plant["price"]);
            $produit->setImage($plant["image"]);
            $produit->setCategorie($plant["category"]);
            $manager->persist($produit);
            $produits[] = $produit;
        }

        // Creating sample customer orders
        for ($i = 1; $i <= 5; $i++) {
            $commande = new Commande();
            $commande->setStatus($statuses[array_rand($statuses)]); // Random status
            $manager->persist($commande);

            // Adding plants to the order
            for ($j = 1; $j <= rand(1, 3); $j++) {
                $commandeProduit = new CommandeProduit();
                $commandeProduit->setCommande($commande);
                $commandeProduit->setProduit($produits[array_rand($produits)]);
                $commandeProduit->setQuantite(rand(1, 3));
                $manager->persist($commandeProduit);
            }
        }

        $manager->flush();
    }
}
