import { Hono } from 'hono'
import { supabase } from '../lib/supabase.js'

const router = new Hono()

router.get('/history/recent', async (c) => {
  try {
    const { data: roasts, error } = await supabase
      .from('roasts')
      .select('username, avatar, updated_at, roast')
      .not('roast', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    return c.json({ success: true, data: roasts })
  } catch (error) {
    console.error('Error fetching history:', error)
    return c.json({ success: false, message: 'Server error' }, 500)
  }
})

router.get('/:username', async (c) => {
  const { username } = c.req.param()
  const cleanUsername = username.toLowerCase()

  try {
    const { data: roast, error } = await supabase
      .from('roasts')
      .select('*')
      .eq('username', cleanUsername)
      .single()

    if (error || !roast) {
      return c.json({ success: false, message: 'Roast not found' }, 404)
    }

    if (roast.questions && !roast.questions_seen) {
      return c.json({
        success: true,
        type: 'questions',
        data: {
          questions: roast.questions,
          username: roast.username,
          avatar: roast.avatar,
        },
      })
    }

    return c.json({
      success: true,
      type: 'summaries',
      data: {
        username: roast.username,
        avatar: roast.avatar,
        languages: roast.languages,
        aiSummaries: {
          detailedRoast: roast.roast,
          strengthAnalysis: roast.strength,
          weaknessAnalysis: roast.weakness,
          loveLifeAnalysis: roast.love_life,
          lifePurposeAnalysis: roast.life_purpose,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching roast data:', error)
    return c.json({ success: false, message: 'Server error' }, 500)
  }
})

router.post('/:username/seen', async (c) => {
  const { username } = c.req.param()
  const cleanUsername = username.toLowerCase()

  try {
    const { data: roast, error } = await supabase
      .from('roasts')
      .update({ questions_seen: true })
      .eq('username', cleanUsername)
      .select()
      .single()

    if (error || !roast) {
      return c.json({ success: false, message: 'Roast not found' }, 404)
    }

    return c.json({ success: true, message: 'Questions marked as seen.' })
  } catch (error) {
    console.error('Error marking questions as seen:', error)
    return c.json({ success: false, message: 'Server error' }, 500)
  }
})

router.delete('/:username', async (c) => {
  const { username } = c.req.param()
  const cleanUsername = username.toLowerCase()

  try {
    const { error } = await supabase
      .from('roasts')
      .delete()
      .eq('username', cleanUsername)

    if (error) {
      return c.json({ success: false, message: 'Roast not found or error deleting' }, 404)
    }

    return c.json({ success: true, message: 'Roast deleted successfully.' })
  } catch (error) {
    console.error('Error deleting roast:', error)
    return c.json({ success: false, message: 'Server error' }, 500)
  }
})

export default router
