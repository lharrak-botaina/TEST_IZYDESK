<?php
namespace App\DataFixtures;

use App\Entity\Categorie;
use App\Entity\Produit;
use App\Entity\Commande;
use App\Entity\CommandeProduit;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        // Création des catégories
        $categories = [];
        for ($i = 1; $i <= 3; $i++) {
            $categorie = new Categorie();
            $categorie->setNom($faker->word());
            $manager->persist($categorie);
            $categories[] = $categorie;
        }

        // Création des produits
        $produits = [];
        for ($i = 1; $i <= 10; $i++) {
            $produit = new Produit();
            $produit->setNom($faker->word());
            $produit->setDescription($faker->sentence());
            $produit->setPrix($faker->randomFloat(2, 5, 500));
            $produit->setImage('https://picsum.photos/200');
            $produit->setCategorie($faker->randomElement($categories));
            $manager->persist($produit);
            $produits[] = $produit;
        }

        // Création des commandes
        for ($i = 1; $i <= 5; $i++) {
            $commande = new Commande();
            $manager->persist($commande);

            // Ajout de produits à la commande
            for ($j = 1; $j <= rand(1, 3); $j++) {
                $commandeProduit = new CommandeProduit();
                $commandeProduit->setCommande($commande);
                $commandeProduit->setProduit($faker->randomElement($produits));
                $commandeProduit->setQuantite(rand(1, 5));
                $manager->persist($commandeProduit);
            }
        }

        $manager->flush();
    }
}
