"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Check } from "lucide-react"
import { useState } from "react"

interface QRCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  url: string
  qrImageUrl?: string
  description?: string
}

export function QRCodeDialog({
  open,
  onOpenChange,
  title = "扫码查看",
  url,
  qrImageUrl,
  description = "请使用手机扫描下方二维码",
}: QRCodeDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [useGeneratedQR, setUseGeneratedQR] = useState(false)

  // 生成二维码
  useEffect(() => {
    if (open && canvasRef.current && (useGeneratedQR || !qrImageUrl)) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 280,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        },
        (error) => {
          if (error) {
            console.error("生成二维码失败:", error)
          }
        }
      )
    }
  }, [open, url, qrImageUrl, useGeneratedQR])

  // 复制链接
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("复制失败:", error)
    }
  }

  // 打开链接
  const handleOpen = () => {
    window.open(url, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {/* 二维码展示区域 */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            {qrImageUrl && !useGeneratedQR ? (
              <img
                src={qrImageUrl}
                alt="二维码"
                className="w-[280px] h-[280px]"
                onError={() => {
                  console.error("加载二维码图片失败，使用本地生成")
                  setUseGeneratedQR(true)
                }}
              />
            ) : (
              <canvas ref={canvasRef} />
            )}
          </div>

          {/* URL 显示和操作 */}
          <div className="w-full space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-muted rounded-md text-sm truncate">
                {url}
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={handleOpen}
                className="shrink-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {copied ? "已复制到剪贴板" : "点击按钮复制链接或在新窗口打开"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
