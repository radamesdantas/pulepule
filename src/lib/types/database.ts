export type UserRole = 'teen' | 'parent' | 'mentor'
export type MissionStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected'
export type CompetencyCategory = 'management' | 'behavioral'
export type MissionContext = 'family' | 'school' | 'community' | 'company'
export type JourneyPhase = 1 | 2 | 3 | 4
export type NotificationType = 'mission_approved' | 'mission_rejected' | 'xp_gained' | 'level_up' | 'badge_earned' | 'new_mission'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      competencies: {
        Row: Competency
        Insert: Omit<Competency, 'id'>
        Update: Partial<Omit<Competency, 'id'>>
      }
      missions: {
        Row: Mission
        Insert: Omit<Mission, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Mission, 'id' | 'created_at'>>
      }
      teen_missions: {
        Row: TeenMission
        Insert: Omit<TeenMission, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TeenMission, 'id' | 'created_at'>>
      }
      teen_xp: {
        Row: TeenXP
        Insert: Omit<TeenXP, 'id' | 'created_at'>
        Update: Partial<Omit<TeenXP, 'id' | 'created_at'>>
      }
      parent_teen: {
        Row: ParentTeen
        Insert: Omit<ParentTeen, 'id' | 'created_at'>
        Update: Partial<Omit<ParentTeen, 'id'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at'>
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>
      }
    }
  }
}

export interface Profile {
  id: string
  email: string
  name: string
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Competency {
  id: number
  name: string
  description: string
  category: CompetencyCategory
  phase: JourneyPhase
  xp_reward: number
  icon: string
}

export interface Mission {
  id: string
  title: string
  description: string
  context: MissionContext
  phase: JourneyPhase
  competency_id: number
  xp_reward: number
  month: number
  created_at: string
  updated_at: string
}

export interface TeenMission {
  id: string
  teen_id: string
  mission_id: string
  status: MissionStatus
  evidence_url: string | null
  evidence_description: string | null
  mentor_feedback: string | null
  parent_approved: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface TeenXP {
  id: string
  teen_id: string
  total_xp: number
  current_level: number
  current_streak: number
  max_streak: number
  badges: string[]
  current_phase: JourneyPhase
  autonomy_index: number
  created_at: string
  updated_at: string
}

export interface ParentTeen {
  id: string
  parent_id: string
  teen_id: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  created_at: string
}
