"use client";

import { useState } from "react";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Check, 
  X, 
  FileText,
  Image as ImageIcon,
  Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface KYCDocument {
  id: string;
  type: "cni" | "registre" | "photo" | "other";
  label: string;
  url: string;
  status?: "pending" | "approved" | "rejected";
}

interface KYCDocumentViewerProps {
  documents: KYCDocument[];
  onApprove?: (documentId: string) => void;
  onReject?: (documentId: string, reason: string) => void;
  isProcessing?: boolean;
  showActions?: boolean;
}

const documentTypeLabels = {
  cni: "Carte Nationale d'Identité",
  registre: "Registre de Commerce",
  photo: "Photo de profil",
  other: "Autre document",
};

const documentTypeColors = {
  cni: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  registre: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  photo: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export function KYCDocumentViewer({
  documents,
  onApprove,
  onReject,
  isProcessing = false,
  showActions = true,
}: KYCDocumentViewerProps) {
  const [selectedDoc, setSelectedDoc] = useState<KYCDocument | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleReject = () => {
    if (rejectingDocId && rejectionReason.trim() && onReject) {
      onReject(rejectingDocId, rejectionReason.trim());
      setRejectingDocId(null);
      setRejectionReason("");
    }
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  return (
    <>
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documents KYC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={cn(
                  "relative group rounded-lg border overflow-hidden",
                  documentTypeColors[doc.type]
                )}
              >
                {/* Document Preview */}
                <div
                  className="aspect-[4/3] bg-gray-900/50 flex items-center justify-center cursor-pointer relative"
                  onClick={() => setSelectedDoc(doc)}
                >
                  {isImage(doc.url) ? (
                    <img
                      src={doc.url}
                      alt={doc.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <FileText className="w-12 h-12" />
                      <span className="text-sm">Aperçu non disponible</span>
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="ghost" size="sm" className="text-white">
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Agrandir
                    </Button>
                  </div>

                  {/* Status Badge */}
                  {doc.status && (
                    <div
                      className={cn(
                        "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium",
                        doc.status === "approved" && "bg-emerald-500/90 text-white",
                        doc.status === "rejected" && "bg-red-500/90 text-white",
                        doc.status === "pending" && "bg-amber-500/90 text-white"
                      )}
                    >
                      {doc.status === "approved" && "Approuvé"}
                      {doc.status === "rejected" && "Rejeté"}
                      {doc.status === "pending" && "En attente"}
                    </div>
                  )}
                </div>

                {/* Document Info */}
                <div className="p-3">
                  <p className="text-sm font-medium text-white truncate">
                    {doc.label || documentTypeLabels[doc.type]}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {documentTypeLabels[doc.type]}
                  </p>

                  {/* Actions */}
                  {showActions && !doc.status && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
                        onClick={() => onApprove?.(doc.id)}
                        disabled={isProcessing}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                        onClick={() => setRejectingDocId(doc.id)}
                        disabled={isProcessing}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun document disponible</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fullscreen Document Dialog */}
      <Dialog
        open={!!selectedDoc}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDoc(null);
            setZoom(100);
            setRotation(0);
          }
        }}
      >
        <DialogContent className="max-w-4xl h-[90vh] bg-gray-900 border-gray-700 flex flex-col">
          {selectedDoc && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedDoc.label || documentTypeLabels[selectedDoc.type]}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {documentTypeLabels[selectedDoc.type]}
                  </p>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleZoomOut}
                    disabled={zoom <= 50}
                    className="text-gray-400 hover:text-white"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-400 w-12 text-center">
                    {zoom}%
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleZoomIn}
                    disabled={zoom >= 200}
                    className="text-gray-400 hover:text-white"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRotate}
                    className="text-gray-400 hover:text-white"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Image Container */}
              <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-950 rounded-lg">
                {isImage(selectedDoc.url) ? (
                  <img
                    src={selectedDoc.url}
                    alt={selectedDoc.label}
                    style={{
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transition: "transform 0.2s ease",
                    }}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-gray-400">
                    <FileText className="w-24 h-24" />
                    <p>Impossible d'afficher ce document</p>
                    <a
                      href={selectedDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Télécharger le document
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              {showActions && !selectedDoc.status && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => setRejectingDocId(selectedDoc.id)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    disabled={isProcessing}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rejeter
                  </Button>
                  <Button
                    onClick={() => onApprove?.(selectedDoc.id)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={isProcessing}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approuver
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog
        open={!!rejectingDocId}
        onOpenChange={(open) => {
          if (!open) {
            setRejectingDocId(null);
            setRejectionReason("");
          }
        }}
      >
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Rejeter le document</h3>
              <p className="text-sm text-gray-400 mt-1">
                Veuillez indiquer la raison du rejet
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason" className="text-gray-300">
                Raison du rejet
              </Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ex: Document illisible, informations incorrectes..."
                className="bg-gray-800 border-gray-700 text-white resize-none"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setRejectingDocId(null);
                  setRejectionReason("");
                }}
                className="text-gray-400 hover:text-white"
              >
                Annuler
              </Button>
              <Button
                onClick={handleReject}
                disabled={!rejectionReason.trim() || isProcessing}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirmer le rejet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
