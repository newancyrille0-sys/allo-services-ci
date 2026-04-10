"use client";

import { useState, useEffect } from "react";
import {
  HeadphonesIcon,
  Search,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Send,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Ticket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    fullName?: string;
    email?: string;
  };
}

// Mock data for demo
const mockTickets: Ticket[] = [
  {
    id: '1',
    userId: 'user1',
    subject: 'Problème de paiement',
    message: 'J\'ai effectué un paiement mais ma réservation n\'est pas confirmée...',
    status: 'open',
    priority: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    user: { fullName: 'Kouassi Jean', email: 'jean@email.com' },
  },
  {
    id: '2',
    userId: 'user2',
    subject: 'Prestataire introuvable',
    message: 'Je ne trouve plus le prestataire avec qui j\'avais réservé...',
    status: 'in_progress',
    priority: 'normal',
    assignedTo: 'admin1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    user: { fullName: 'Aminata Diallo', email: 'aminata@email.com' },
  },
  {
    id: '3',
    userId: 'user3',
    subject: 'Question sur les abonnements',
    message: 'Comment fonctionne l\'abonnement Premium ?',
    status: 'resolved',
    priority: 'low',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    user: { fullName: 'Yao Serge', email: 'yao@email.com' },
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  open: { label: 'Ouvert', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: AlertCircle },
  in_progress: { label: 'En cours', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
  resolved: { label: 'Résolu', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
  closed: { label: 'Fermé', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: CheckCircle },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: 'Basse', color: 'text-gray-400' },
  normal: { label: 'Normale', color: 'text-blue-400' },
  high: { label: 'Haute', color: 'text-orange-400' },
  urgent: { label: 'Urgente', color: 'text-red-400' },
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyMessage, setReplyMessage] = useState("");

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    // In a real app, this would send the reply to the API
    console.log('Sending reply:', replyMessage);
    setReplyMessage("");
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Support Client</h1>
          <p className="text-gray-400 mt-1">
            Gérez les tickets et répondez aux demandes des clients
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <HeadphonesIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Tickets</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <AlertCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Ouverts</p>
                <p className="text-2xl font-bold text-white">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">En cours</p>
                <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Résolus</p>
                <p className="text-2xl font-bold text-white">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">Tickets</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="open">Ouverts</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="resolved">Résolus</SelectItem>
                    <SelectItem value="closed">Fermés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto">
                {filteredTickets.map((ticket) => {
                  const statusConfig = STATUS_CONFIG[ticket.status];
                  const isSelected = selectedTicket?.id === ticket.id;
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-4 border-b border-gray-700 cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary/10' : 'hover:bg-gray-700/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{ticket.subject}</p>
                          <p className="text-gray-400 text-sm truncate">{ticket.user?.fullName}</p>
                        </div>
                        <Badge className={statusConfig.color} variant="outline">
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className={PRIORITY_CONFIG[ticket.priority].color}>
                          {PRIORITY_CONFIG[ticket.priority].label}
                        </span>
                        <span>{formatDate(ticket.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white">{selectedTicket.subject}</CardTitle>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge className={STATUS_CONFIG[selectedTicket.status].color} variant="outline">
                        {STATUS_CONFIG[selectedTicket.status].label}
                      </Badge>
                      <span className={`text-sm ${PRIORITY_CONFIG[selectedTicket.priority].color}`}>
                        Priorité: {PRIORITY_CONFIG[selectedTicket.priority].label}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="border-gray-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <Avatar>
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {selectedTicket.user?.fullName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{selectedTicket.user?.fullName}</p>
                    <p className="text-gray-400 text-sm">{selectedTicket.user?.email}</p>
                  </div>
                </div>

                {/* Original Message */}
                <div className="p-4 bg-gray-700/20 rounded-lg">
                  <p className="text-gray-300 text-sm mb-2">{formatDate(selectedTicket.createdAt)}</p>
                  <p className="text-white">{selectedTicket.message}</p>
                </div>

                {/* Reply Section */}
                <div className="space-y-3">
                  <label className="text-sm text-gray-300">Répondre</label>
                  <Textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Écrivez votre réponse..."
                    className="bg-gray-700 border-gray-600 min-h-[120px]"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-gray-300"
                      >
                        Changer statut
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-gray-300"
                      >
                        Assigner
                      </Button>
                    </div>
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim()}
                      className="bg-primary"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800/50 border-gray-700 h-[500px] flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Sélectionnez un ticket pour voir les détails</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
