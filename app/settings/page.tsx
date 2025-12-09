"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Settings, Key, Link as LinkIcon, Save } from "lucide-react"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">设置</h1>
        <p className="text-muted-foreground mt-2">
          配置API密钥和系统参数
        </p>
      </div>

      <Tabs defaultValue="api" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api">
            <Key className="mr-2 h-4 w-4" />
            API配置
          </TabsTrigger>
          <TabsTrigger value="platform">
            <LinkIcon className="mr-2 h-4 w-4" />
            平台配置
          </TabsTrigger>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            通用设置
          </TabsTrigger>
        </TabsList>

        {/* API配置 */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI模型配置</CardTitle>
              <CardDescription>
                配置OpenAI兼容的API接口，用于内容分析和生成
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-api-url">API地址</Label>
                <Input
                  id="ai-api-url"
                  placeholder="https://api.openai.com/v1"
                  defaultValue="https://api.openai.com/v1"
                />
                <p className="text-sm text-muted-foreground">
                  支持OpenAI、通义千问、智谱等兼容接口
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-api-key">API Key</Label>
                <Input
                  id="ai-api-key"
                  type="password"
                  placeholder="sk-..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-model">模型</Label>
                <Input
                  id="ai-model"
                  placeholder="gpt-4"
                  defaultValue="gpt-4"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">连接测试</p>
                  <p className="text-sm text-muted-foreground">
                    验证API配置是否正确
                  </p>
                </div>
                <Button variant="outline">测试连接</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>公众号文章API</CardTitle>
              <CardDescription>
                配置用于获取公众号文章数据的第三方API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wechat-api-url">API地址</Label>
                <Input
                  id="wechat-api-url"
                  placeholder="https://api.example.com/wechat"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wechat-api-key">API Key</Label>
                <Input
                  id="wechat-api-key"
                  type="password"
                  placeholder="请输入API Key"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unsplash配置</CardTitle>
              <CardDescription>
                配置Unsplash API用于获取文章配图
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unsplash-access-key">Access Key</Label>
                <Input
                  id="unsplash-access-key"
                  type="password"
                  placeholder="请输入Unsplash Access Key"
                />
                <p className="text-sm text-muted-foreground">
                  在{" "}
                  <a
                    href="https://unsplash.com/developers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Unsplash Developers
                  </a>{" "}
                  获取
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 平台配置 */}
        <TabsContent value="platform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>小红书配置</CardTitle>
              <CardDescription>
                配置小红书发布API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="xhs-api-url">API地址</Label>
                <Input
                  id="xhs-api-url"
                  placeholder="https://api.example.com/xiaohongshu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="xhs-api-key">API Key</Label>
                <Input
                  id="xhs-api-key"
                  type="password"
                  placeholder="请输入API Key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="xhs-account">账号ID</Label>
                <Input
                  id="xhs-account"
                  placeholder="请输入小红书账号ID"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">连接状态</p>
                  <p className="text-sm text-muted-foreground">
                    未配置
                  </p>
                </div>
                <Button variant="outline">测试连接</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>公众号配置</CardTitle>
              <CardDescription>
                配置微信公众号发布API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mp-api-url">API地址</Label>
                <Input
                  id="mp-api-url"
                  placeholder="https://api.example.com/wechat-mp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mp-appid">AppID</Label>
                <Input
                  id="mp-appid"
                  placeholder="请输入公众号AppID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mp-secret">AppSecret</Label>
                <Input
                  id="mp-secret"
                  type="password"
                  placeholder="请输入AppSecret"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">连接状态</p>
                  <p className="text-sm text-muted-foreground">
                    未配置
                  </p>
                </div>
                <Button variant="outline">测试连接</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通用设置 */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>内容创作默认设置</CardTitle>
              <CardDescription>
                设置AI创作的默认参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-word-count">默认文章长度</Label>
                <Input
                  id="default-word-count"
                  defaultValue="1000-1500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-style">默认写作风格</Label>
                <Input
                  id="default-style"
                  defaultValue="专业严谨"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-images">默认配图数量</Label>
                <Input
                  id="default-images"
                  type="number"
                  defaultValue="3"
                  min="0"
                  max="10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>选题分析默认设置</CardTitle>
              <CardDescription>
                设置选题分析的默认参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="analysis-count">分析文章数量</Label>
                <Input
                  id="analysis-count"
                  type="number"
                  defaultValue="20"
                  min="10"
                  max="100"
                />
                <p className="text-sm text-muted-foreground">
                  每次分析抓取的文章数量（10-100）
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insights-count">生成洞察数量</Label>
                <Input
                  id="insights-count"
                  type="number"
                  defaultValue="5"
                  min="3"
                  max="10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>系统信息</CardTitle>
              <CardDescription>
                查看系统版本和相关信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">版本</span>
                <span className="font-mono">v1.0.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">数据库</span>
                <span className="font-mono">SQLite</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">框架</span>
                <span className="font-mono">Next.js 15</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 保存按钮 */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">重置</Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          {saved ? "已保存" : "保存设置"}
        </Button>
      </div>
    </div>
  )
}
