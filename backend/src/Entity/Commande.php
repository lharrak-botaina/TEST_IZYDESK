<?php
namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity()]
class Commande
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["commande:read"])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(["commande:read"])]
    private \DateTimeImmutable $date;

    #[ORM\OneToMany(mappedBy: "commande", targetEntity: CommandeProduit::class, cascade: ["persist", "remove"])]
    #[Groups(["commande:read"])]
    private Collection $produits;

    public function __construct()
    {
        $this->date = new \DateTimeImmutable();
        $this->produits = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): \DateTimeImmutable
    {
        return $this->date;
    }

    public function getProduits(): Collection
    {
        return $this->produits;
    }

    public function addProduit(CommandeProduit $commandeProduit): static
    {
        if (!$this->produits->contains($commandeProduit)) {
            $this->produits->add($commandeProduit);
            $commandeProduit->setCommande($this);
        }
        return $this;
    }
}
