"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import {
  PUBLIC_ADDRESS_LINE_1,
  PUBLIC_ADDRESS_CITY_COUNTRY,
  PUBLIC_PHONE_PRIMARY,
  PUBLIC_PHONE_SECONDARY,
  PUBLIC_EMAIL_PRIMARY,
  PUBLIC_EMAIL_SECONDARY,
  PUBLIC_HOURS_WEEKDAY,
  PUBLIC_HOURS_SUNDAY,
  getWhatsAppUrlWithText,
} from "@/lib/config";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // En production, envoyer à une API
    console.log("Form submitted:", formData);
    alert("Message envoyé ! Nous vous répondrons rapidement.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleWhatsApp = () => {
    const url = getWhatsAppUrlWithText(
      "Bonjour, je souhaite obtenir plus d'informations sur vos services."
    );
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <Badge variant="secondary" className="uppercase tracking-wide">
              Contact
            </Badge>
            <h1 className="font-bebas text-6xl md:text-7xl tracking-wider leading-tight text-balance">
              CONTACTEZ-NOUS
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Une question ? Un conseil ? Notre équipe est à votre écoute
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="font-bebas text-4xl tracking-wide">
                  INFORMATIONS
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Visitez-nous ou contactez-nous par téléphone, email ou
                  WhatsApp. Nous sommes là pour vous.
                </p>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="h-12 w-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Adresse</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {PUBLIC_ADDRESS_LINE_1}
                        <br />
                        {PUBLIC_ADDRESS_CITY_COUNTRY}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Phone */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="h-12 w-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Téléphone</h3>
                      <p className="text-sm text-muted-foreground">
                        {PUBLIC_PHONE_PRIMARY}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {PUBLIC_PHONE_SECONDARY}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="h-12 w-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-sm text-muted-foreground">
                        {PUBLIC_EMAIL_PRIMARY}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {PUBLIC_EMAIL_SECONDARY}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Hours */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="h-12 w-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Horaires</h3>
                      <p className="text-sm text-muted-foreground">
                        {PUBLIC_HOURS_WEEKDAY}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {PUBLIC_HOURS_SUNDAY}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* WhatsApp Button */}
              <Button
                onClick={handleWhatsApp}
                size="lg"
                className="w-full uppercase tracking-wide bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Contacter via WhatsApp
              </Button>
            </div>

            {/* Contact Form */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="font-bebas text-3xl tracking-wide">
                  ENVOYEZ-NOUS UN MESSAGE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nom complet
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
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Téléphone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Votre message..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full uppercase tracking-wide group"
                  >
                    <Send className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="font-bebas text-5xl md:text-6xl tracking-wider">
                NOTRE LOCALISATION
              </h2>
              <p className="text-muted-foreground text-lg">
                Trouvez-nous facilement au cœur de Yaoundé
              </p>
            </div>

            {/* Map Placeholder */}
            <Card className="overflow-hidden shadow-xl">
              <div className="relative h-96 bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127118.8157!2d11.5021!3d3.8480!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7a309db577%3A0x2ff98e7ff0d47b96!2sYaound%C3%A9%2C%20Cameroon!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bénédiction Barber Location"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
