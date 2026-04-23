const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface PricingPlan {
  id: string
  name: string
  classes: number
  price: number
  currency: string
  description: string | null
  active: boolean
  isDefault: boolean
}

export interface LandingSettings {
  businessName: string
  phone: string
  whatsapp: string
  email: string
  address: string
  schedule: string
  socialMedia: {
    instagram?: string
    facebook?: string
  }
}

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  avatarUrl: string | null
  plan: string | null
}

export interface GalleryImage {
  id: string
  title: string | null
  altText: string | null
  imageUrl: string
  category: string
  order: number
}

export interface ScheduleItem {
  day: string
  time: string
}

export interface Activity {
  id: string
  name: string
  ages: string
  icon: string
  features: string[]
  schedule: ScheduleItem[]
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const json = await response.json()
  if (!json.success) {
    throw new Error(json.error || 'API request failed')
  }

  return json.data as T
}

export const api = {
  pricing: () => fetchApi<PricingPlan[]>('/api/landing/pricing'),
  settings: () => fetchApi<LandingSettings>('/api/landing/settings'),
  testimonials: () => fetchApi<Testimonial[]>('/api/landing/testimonials'),
  gallery: () => fetchApi<GalleryImage[]>('/api/landing/gallery'),
  activities: () => fetchApi<Activity[]>('/api/landing/activities'),
}
