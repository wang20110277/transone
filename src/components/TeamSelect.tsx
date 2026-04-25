import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Plus, 
  ChevronRight, 
  Users, 
  Globe, 
  Settings2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Tenant } from '../types';

interface TeamSelectProps {
  tenants: Tenant[];
  onSelect: (tenant: Tenant) => void;
  onLogout: () => void;
}

export function TeamSelect({ tenants, onSelect, onLogout }: TeamSelectProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[640px]"
      >
        <div className="flex justify-between items-center mb-8 px-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">选择或加入团队</h2>
            <p className="text-sm text-muted-foreground mt-1">请选择要进入的工作空间，或申请加入新团队</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground">
            退出登录
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tenants.map((tenant) => (
            <Card 
              key={tenant.id} 
              className="group p-6 cursor-pointer hover:shadow-xl hover:shadow-primary/5 transition-all bg-card border-zinc-200 dark:border-zinc-800"
              onClick={() => onSelect(tenant)}
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {tenant.logo ? (
                    <img src={tenant.logo} alt={tenant.name} className="w-8 h-8 object-contain" />
                  ) : (
                    <Building2 className="w-7 h-7" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold">{tenant.name}</h3>
                    <Badge variant="secondary" className="text-[10px] bg-primary/5 text-primary border-none">
                      已加入
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Settings2 className="w-3.5 h-3.5" />
                      {tenant.permissions.length} 个功能模块
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}

          <Card className="border-dashed border-2 p-6 flex flex-col items-center justify-center gap-3 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
            <div className="bg-background p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-bold">申请加入新工作空间</h3>
              <p className="text-xs text-muted-foreground mt-1">输入团队代码或联系管理员</p>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-4">
          <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> 简体中文</span>
          <span className="flex items-center gap-1 hover:text-primary cursor-pointer underline underline-offset-4">查看帮助中心</span>
        </div>
      </motion.div>
    </div>
  );
}
