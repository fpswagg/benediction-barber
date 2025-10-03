"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  User,
  Scissors,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { getWhatsAppUrlWithText } from "@/lib/config";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import servicesData from "@/data/services.json";
import teamData from "@/data/team.json";

export default function ReservationPage() {
  const searchParams = useSearchParams();
  const preSelectedService = searchParams.get("service");
  const preSelectedBarber = searchParams.get("barber");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    service: preSelectedService || "",
    barber: preSelectedBarber || "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Flatten all services for the select
  const allServices = servicesData.categories.flatMap((cat) =>
    cat.services.map((service) => ({
      id: service.id,
      name: service.name,
      category: cat.name,
      price: service.price,
      duration: service.duration,
    }))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsAppBooking = () => {
    const selectedService = allServices.find((s) => s.id === formData.service);
    const selectedBarber = teamData.members.find(
      (b) => b.id === formData.barber
    );

    const message = `Bonjour Bénédiction Barber,

Je souhaite réserver un rendez-vous :

👤 Nom : ${formData.name}
📞 Téléphone : ${formData.phone}
📧 Email : ${formData.email}
📅 Date : ${formData.date}
🕐 Heure : ${formData.time}
✂️ Service : ${selectedService?.name || "Non spécifié"} (${
      selectedService?.price
    } FCFA)
💈 Barbier : ${selectedBarber?.name || "Pas de préférence"}
${formData.notes ? `📝 Notes : ${formData.notes}` : ""}

Merci !`;

    const url = getWhatsAppUrlWithText(message);
    window.open(url, "_blank");
  };

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen">
        <section className="pt-32 pb-20 flex-1 flex items-center justify-center bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto text-center shadow-2xl animate-fade-in-up">
              <CardContent className="p-12 space-y-6">
                <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="font-bebas text-4xl tracking-wider">
                  DEMANDE ENREGISTRÉE
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Votre demande de réservation a été enregistrée. Pour confirmer
                  votre rendez-vous rapidement, cliquez sur le bouton ci-dessous
                  pour nous contacter via WhatsApp.
                </p>
                <div className="space-y-4 pt-4">
                  <Button
                    onClick={handleWhatsAppBooking}
                    size="lg"
                    className="w-full uppercase tracking-wide bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Confirmer via WhatsApp
                  </Button>
                  <Button
                    onClick={() => setSubmitted(false)}
                    size="lg"
                    variant="outline"
                    className="w-full uppercase tracking-wide"
                  >
                    Modifier la réservation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <Badge variant="secondary" className="uppercase tracking-wide">
              Réservation
            </Badge>
            <h1 className="font-bebas text-6xl md:text-7xl tracking-wider leading-tight text-balance">
              RÉSERVEZ VOTRE RENDEZ-VOUS
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Remplissez le formulaire ci-dessous et confirmez rapidement via
              WhatsApp
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="font-bebas text-3xl tracking-wide">
                    INFORMATIONS DE RÉSERVATION
                  </CardTitle>
                  <CardDescription>
                    Remplissez tous les champs pour réserver votre rendez-vous
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Informations personnelles
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Nom complet *
                          </label>
                          <Input
                            id="name"
                            placeholder="Votre nom"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="text-sm font-medium"
                          >
                            Téléphone *
                          </label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+237 6XX XXX XXX"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Date et heure
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="date" className="text-sm font-medium">
                            Date *
                          </label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                              setFormData({ ...formData, date: e.target.value })
                            }
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="time" className="text-sm font-medium">
                            Heure *
                          </label>
                          <Input
                            id="time"
                            type="time"
                            value={formData.time}
                            onChange={(e) =>
                              setFormData({ ...formData, time: e.target.value })
                            }
                            min="09:00"
                            max="20:00"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Service & Barber */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Scissors className="h-5 w-5 text-primary" />
                        Service et barbier
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="service"
                            className="text-sm font-medium"
                          >
                            Service *
                          </label>
                          <select
                            id="service"
                            value={formData.service}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                service: e.target.value,
                              })
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            required
                          >
                            <option value="">Sélectionnez un service</option>
                            {servicesData.categories.map((category) => (
                              <optgroup key={category.id} label={category.name}>
                                {category.services.map((service) => (
                                  <option key={service.id} value={service.id}>
                                    {service.name} - {service.price} FCFA (
                                    {service.duration} min)
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="barber"
                            className="text-sm font-medium"
                          >
                            Barbier (optionnel)
                          </label>
                          <select
                            id="barber"
                            value={formData.barber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                barber: e.target.value,
                              })
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="">Pas de préférence</option>
                            {teamData.members
                              .filter((member) => member.available)
                              .map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.name} - {member.role}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <label htmlFor="notes" className="text-sm font-medium">
                        Notes additionnelles
                      </label>
                      <Textarea
                        id="notes"
                        placeholder="Précisions sur votre demande, style souhaité, etc."
                        rows={4}
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full uppercase tracking-wide"
                    >
                      Continuer vers la confirmation
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Quick WhatsApp */}
              <Card className="shadow-lg border-2 border-green-600">
                <CardHeader>
                  <CardTitle className="font-bebas text-2xl tracking-wide flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                    Réservation Express
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Besoin d'un rendez-vous urgent ? Contactez-nous directement
                    via WhatsApp pour une réponse immédiate.
                  </p>
                  <Button
                    onClick={() => {
                      const url = getWhatsAppUrlWithText(
                        "Bonjour, je souhaite réserver un rendez-vous rapidement."
                      );
                      window.open(url, "_blank");
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white uppercase tracking-wide"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp Direct
                  </Button>
                </CardContent>
              </Card>

              {/* Info Cards */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-bebas text-2xl tracking-wide">
                    Informations utiles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Horaires</p>
                      <p className="text-xs text-muted-foreground">
                        Lun-Sam: 9h-20h | Dim: 10h-18h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Confirmation</p>
                      <p className="text-xs text-muted-foreground">
                        Votre rendez-vous sera confirmé par WhatsApp dans les 30
                        minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Scissors className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Annulation</p>
                      <p className="text-xs text-muted-foreground">
                        Merci de prévenir 24h à l'avance en cas d'empêchement
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Services */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-bebas text-2xl tracking-wide">
                    Services populaires
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {allServices
                    .filter(
                      (s) =>
                        s.id === "coupe-moderne" ||
                        s.id === "degrade" ||
                        s.id === "bain-visage"
                    )
                    .map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {service.name}
                        </span>
                        <Badge variant="outline">{service.price} FCFA</Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
