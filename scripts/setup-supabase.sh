#!/bin/bash

# ============================================
# Script de configuration Supabase
# Allo Services CI
# ============================================

echo "🚀 Configuration de la base de données Supabase..."
echo ""

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo "❌ Fichier .env non trouvé!"
    echo "📝 Créez un fichier .env avec vos identifiants Supabase:"
    echo ""
    echo "DATABASE_URL=\"postgresql://postgres:PASSWORD@db.PROJECT-REF.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1\""
    echo "DIRECT_URL=\"postgresql://postgres:PASSWORD@db.PROJECT-REF.supabase.co:5432/postgres\""
    echo ""
    exit 1
fi

echo "📦 Génération du client Prisma..."
npx prisma generate

echo ""
echo "🗄️  Synchronisation du schéma avec Supabase..."
echo "⚠️  Attention: Cette opération peut supprimer des données existantes!"
echo ""
read -p "Continuer? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma db push --accept-data-loss

    echo ""
    echo "✅ Base de données configurée avec succès!"
    echo ""
    echo "📊 Vous pouvez maintenant:"
    echo "   1. Lancer le serveur: bun run dev"
    echo "   2. Voir les tables dans Supabase Dashboard"
    echo ""
else
    echo "❌ Opération annulée."
fi
