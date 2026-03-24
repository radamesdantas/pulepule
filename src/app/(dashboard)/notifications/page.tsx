import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MarkReadButton from './MarkReadButton'

const TYPE_ICON: Record<string, string> = {
  mission_approved: '✅',
  mission_rejected: '↩️',
  xp_gained: '⚡',
  level_up: '🎉',
  badge_earned: '🏆',
  new_mission: '🎯',
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const unread = notifications?.filter(n => !n.read).length ?? 0

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Notificações
          </h1>
          {unread > 0 && (
            <p className="text-sm text-teen-purple font-semibold mt-0.5">{unread} não lida{unread > 1 ? 's' : ''}</p>
          )}
        </div>
        {unread > 0 && <MarkReadButton userId={user.id} />}
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                !n.read ? 'border-teen-purple/30 bg-purple-50/30' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{TYPE_ICON[n.type] ?? '🔔'}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm">{n.title}</p>
                  <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {new Date(n.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 bg-teen-purple rounded-full mt-1.5 shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <p className="text-4xl mb-3">🔔</p>
          <h3 className="font-black text-gray-700" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Tudo em dia!
          </h3>
          <p className="text-gray-400 text-sm mt-1">Nenhuma notificação por enquanto.</p>
        </div>
      )}
    </div>
  )
}
