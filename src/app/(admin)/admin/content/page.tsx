"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  AlertTriangle,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Image,
  Video,
  MessageSquare,
  Filter,
  Clock,
  User,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for demo
const mockReports = [
  {
    id: '1',
    type: 'publication',
    contentType: 'photo',
    contentId: 'pub1',
    reporterId: 'user1',
    reporterName: 'Aminata Diallo',
    reportedUserId: 'provider1',
    reportedUserName: 'Jean Kouassi',
    reason: 'Contenu inapproprié',
    description: 'Cette photo ne correspond pas à un service professionnel',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    contentPreview: 'https://picsum.photos/400/300',
  },
  {
    id: '2',
    type: 'comment',
    contentType: 'comment',
    contentId: 'comment1',
    reporterId: 'user2',
    reporterName: 'Yao Serge',
    reportedUserId: 'user3',
    reportedUserName: 'Mamadou Kone',
    reason: 'Spam',
    description: 'Ce commentaire est du spam publicitaire',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    contentPreview: null,
    commentText: 'Achetez nos produits à prix réduit! Contactez-nous...',
  },
  {
    id: '3',
    type: 'publication',
    contentType: 'video',
    contentId: 'pub2',
    reporterId: 'user3',
    reporterName: 'Fatou Bamba',
    reportedUserId: 'provider2',
    reportedUserName: 'Ibrahim Traoré',
    reason: 'Fausse publicité',
    description: 'La vidéo montre un travail qui n\'est pas celui du prestataire',
    status: 'reviewed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    contentPreview: null,
  },
];

const REPORT_REASONS: Record<string, { label: string; color: string }> = {
  inappropriate_content: { label: 'Contenu inapproprié', color: 'text-red-400' },
  spam: { label: 'Spam', color: 'text-orange-400' },
  fake_profile: { label: 'Faux profil', color: 'text-yellow-400' },
  harassment: { label: 'Harcèlement', color: 'text-red-400' },
  fake_advertising: { label: 'Fausse publicité', color: 'text-orange-400' },
  other: { label: 'Autre', color: 'text-gray-400' },
};

export default function ContentModerationPage() {
  const [reports, setReports] = useState(mockReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedUserName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    reviewed: reports.filter(r => r.status === 'reviewed').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleApprove = (reportId: string) => {
    setReports(reports.map(r =>
      r.id === reportId ? { ...r, status: 'resolved' } : r
    ));
    setSelectedReport(null);
  };

  const handleDelete = () => {
    if (!selectedReport) return;
    setReports(reports.map(r =>
      r.id === selectedReport.id ? { ...r, status: 'resolved' } : r
    ));
    setIsDeleteDialogOpen(false);
    setSelectedReport(null);
  };

  const ContentTypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'photo':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Modération de Contenu</h1>
          <p className="text-gray-400 mt-1">
            Gérez les signalements et modérez les contenus inappropriés
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Signalements</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">En attente</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Eye className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Examinés</p>
                <p className="text-2xl font-bold text-white">{stats.reviewed}</p>
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

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="reviewed">Examinés</SelectItem>
            <SelectItem value="resolved">Résolus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <Card
            key={report.id}
            className={`bg-gray-800/50 border-gray-700 cursor-pointer transition-colors ${
              selectedReport?.id === report.id ? 'ring-2 ring-primary' : 'hover:bg-gray-800/70'
            }`}
            onClick={() => setSelectedReport(report)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-700">
                    <ContentTypeIcon type={report.contentType} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium capitalize">{report.contentType}</p>
                      <Badge
                        variant="outline"
                        className={
                          report.status === 'pending'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : report.status === 'reviewed'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                        }
                      >
                        {report.status === 'pending' ? 'En attente' : report.status === 'reviewed' ? 'Examiné' : 'Résolu'}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{report.reason}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="text-gray-400">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                    <DropdownMenuItem
                      className="text-green-400 focus:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(report.id);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approuver
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-400 focus:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(report);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Signalé par</p>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-300">{report.reporterName}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Auteur du contenu</p>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-300">{report.reportedUserName}</span>
                  </div>
                </div>
              </div>

              {report.description && (
                <p className="text-gray-400 text-sm mt-3 line-clamp-2">
                  "{report.description}"
                </p>
              )}

              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatDate(report.createdAt)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>Supprimer le contenu</DialogTitle>
            <DialogDescription className="text-gray-400">
              Êtes-vous sûr de vouloir supprimer ce contenu ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-700"
            >
              Annuler
            </Button>
            <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
