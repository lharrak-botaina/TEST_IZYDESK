<?php
namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity()]
class Commande
{
    public const STATUS_PENDING = "Pending";
    public const STATUS_DISPATCHED = "Dispatched";
    public const STATUS_DELIVERED = "Delivered";
    public const STATUS_CANCELED = "Canceled";

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["commande:read"])]
    private ?int $id = null;

    #[ORM\Column(type: "datetime")]
    #[Groups(["commande:read"])]
    private \DateTime $date;

    #[ORM\Column(type: "string", length: 20)]
    #[Groups(["commande:read"])]
    private string $status = self::STATUS_PENDING;

    #[ORM\OneToMany(mappedBy: "commande", targetEntity: CommandeProduit::class, cascade: ["persist", "remove"])]
    #[Groups(["commande:read"])]
    private Collection $produits;

    public function __construct()
    {
        $this->date = new \DateTime();
        $this->produits = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): \DateTime
    {
        return $this->date;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $validStatuses = [
            self::STATUS_PENDING,
            self::STATUS_DISPATCHED,
            self::STATUS_DELIVERED,
            self::STATUS_CANCELED,
        ];

        if (!in_array($status, $validStatuses, true)) {
            throw new \InvalidArgumentException("Invalid status: $status");
        }

        $this->status = $status;
        return $this;
    }

    public function getProduits(): Collection
    {
        return $this->produits;
    }
}
