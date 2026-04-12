'use client';

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Users, 
  Star,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// ==================== TYPES ====================

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export interface ProviderStatsOverviewProps {
  totalRevenue: number;
  totalReservations: number;
  completedCount: number;
  averageRating: number;
  revenueGrowth: number;
  reservationGrowth: number;
  className?: string;
}

// ==================== STAT CARD ====================

export function StatCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon,
  trend,
  variant = 'default',
}: StatCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-l-4 border-l-green-500';
      case 'warning':
        return 'border-l-4 border-l-amber-500';
      case 'danger':
        return 'border-l-4 border-l-red-500';
      default:
        return '';
    }
  };

  return (
    <Card className={cn(getVariantStyles())}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {trend === 'up' && (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                )}
                {trend === 'down' && (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend === 'up' && 'text-green-500',
                    trend === 'down' && 'text-red-500',
                    trend === 'neutral' && 'text-gray-500'
                  )}
                >
                  {change > 0 ? '+' : ''}{change}%
                </span>
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">
                    {changeLabel}
                  </span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== PROVIDER STATS OVERVIEW ====================

export function ProviderStatsOverview({
  totalRevenue,
  totalReservations,
  completedCount,
  averageRating,
  revenueGrowth,
  reservationGrowth,
  className,
}: ProviderStatsOverviewProps) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      <StatCard
        title="Revenus du mois"
        value={`${totalRevenue.toLocaleString('fr-FR')} FCFA`}
        change={revenueGrowth}
        changeLabel="vs mois dernier"
        trend={revenueGrowth >= 0 ? 'up' : 'down'}
        icon={<DollarSign className="h-5 w-5" />}
        variant="success"
      />
      <StatCard
        title="Réservations"
        value={completedCount}
        subtitle={`${totalReservations} au total`}
        change={reservationGrowth}
        changeLabel="vs mois dernier"
        trend={reservationGrowth >= 0 ? 'up' : 'down'}
        icon={<Calendar className="h-5 w-5" />}
      />
      <StatCard
        title="Note moyenne"
        value={averageRating > 0 ? `${averageRating}/5` : 'N/A'}
        subtitle={averageRating > 0 ? `${completedCount} avis` : 'Pas encore d\'avis'}
        icon={<Star className="h-5 w-5" />}
        variant={averageRating >= 4 ? 'success' : averageRating >= 3 ? 'warning' : 'default'}
      />
      <StatCard
        title="Taux de complétion"
        value={totalReservations > 0 
          ? `${Math.round((completedCount / totalReservations) * 100)}%` 
          : '0%'
        }
        subtitle={`${completedCount} terminées`}
        icon={<TrendingUp className="h-5 w-5" />}
        variant="success"
      />
    </div>
  );
}

// ==================== REVENUE CHART PLACEHOLDER ====================

export function RevenueChartPlaceholder({ className }: { className?: string }) {
  // Données fictives pour la démonstration
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
  const data = [45000, 52000, 48000, 61000, 55000, 72000];
  const maxValue = Math.max(...data);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Évolution des revenus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 h-40">
          {data.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-primary/20 rounded-t hover:bg-primary/40 transition-colors"
                style={{ height: `${(value / maxValue) * 100}%` }}
                title={`${value.toLocaleString('fr-FR')} FCFA`}
              />
              <span className="text-xs text-muted-foreground">{months[index]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== PEAK HOURS CHART ====================

export function PeakHoursChart({ 
  data,
  className 
}: { 
  data: { hour: number; count: number }[];
  className?: string;
}) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Heures de pointe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-16 text-sm text-muted-foreground">
                {item.hour}h
              </span>
              <Progress 
                value={(item.count / maxCount) * 100} 
                className="flex-1"
              />
              <span className="text-sm font-medium">{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== TOP CLIENTS LIST ====================

export function TopClientsList({ 
  clients,
  className 
}: { 
  clients: { id: string; count: number; spent: number }[];
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4" />
          Clients réguliers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {clients.slice(0, 5).map((client, index) => (
            <div key={client.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  #{index + 1}
                </span>
                <span className="text-sm">Client {client.id.slice(-6)}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {client.spent.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-xs text-muted-foreground">
                  {client.count} réservation{client.count > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          ))}
          {clients.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Pas encore de clients réguliers
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== QUICK ACTIONS ====================

export function ProviderQuickActions({ className }: { className?: string }) {
  const actions = [
    { label: 'Mes factures', href: '/dashboard/invoices', icon: '📄' },
    { label: 'Mon planning', href: '/dashboard/planning', icon: '📅' },
    { label: 'Mes avis', href: '/dashboard/reviews', icon: '⭐' },
    { label: 'Parrainer', href: '/dashboard/referral', icon: '🎁' },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="flex items-center gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <span className="text-lg">{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== COMMISSION INFO ====================

export function CommissionInfoCard({ 
  currentRate,
  nextTierReservations,
  className 
}: { 
  currentRate: number;
  nextTierReservations?: number;
  className?: string;
}) {
  const getTierInfo = () => {
    if (currentRate <= 0.10) return { tier: 'Premium', color: 'text-purple-600', next: null };
    if (currentRate <= 0.12) return { tier: 'Standard', color: 'text-blue-600', next: { target: 31, rate: '10%' } };
    return { tier: 'Basic', color: 'text-gray-600', next: { target: 11, rate: '12%' } };
  };

  const tierInfo = getTierInfo();
  const currentRatePercent = currentRate * 100;

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Votre commission</span>
          <Badge variant="outline" className={tierInfo.color}>
            {tierInfo.tier}
          </Badge>
        </div>
        <p className="text-2xl font-bold">{currentRatePercent}%</p>
        {tierInfo.next && nextTierReservations !== undefined && (
          <p className="text-xs text-muted-foreground mt-1">
            Plus que <strong>{nextTierReservations} réservations</strong> pour atteindre {tierInfo.next.rate}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== EXPORTS ====================

export default {
  StatCard,
  ProviderStatsOverview,
  RevenueChartPlaceholder,
  PeakHoursChart,
  TopClientsList,
  ProviderQuickActions,
  CommissionInfoCard,
};
