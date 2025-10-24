import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { JobTracking, JobStatus } from '@/types/job';

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_job_tracking')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url, company, position, experience, keywords, deadline } = body;

    // Validate required fields
    if (!url || !company || !position) {
      return NextResponse.json(
        { error: 'URL, company, and position are required' },
        { status: 400 }
      );
    }

    // Create new job tracking entry
    const jobData: Partial<JobTracking> = {
      user_id: user.id,
      url,
      company,
      position,
      experience: experience || null,
      keywords: keywords || [],
      status: 'interested' as JobStatus,
      deadline: deadline || null,
    };

    const { data, error } = await supabase
      .from('user_job_tracking')
      .insert([jobData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
