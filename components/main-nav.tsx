"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, FileEdit, Settings, ListChecks, Home } from "lucide-react"

const navigation = [
  { name: "首页", href: "/", icon: Home },
  { name: "选题分析", href: "/topic-analysis", icon: BarChart3 },
  { name: "内容创作", href: "/content-creation", icon: FileEdit },
  { name: "发布管理", href: "/publish-management", icon: ListChecks },
  { name: "设置", href: "/settings", icon: Settings },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-6">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              isActive
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
