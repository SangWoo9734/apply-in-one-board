import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // TODO: Puppeteer 크롤링 로직 구현 예정
    // 현재는 기본값 반환
    const scrapedData = {
      company: null,
      position: null,
      experience: null,
      keywords: [],
      deadline: null,
    };

    return NextResponse.json({ data: scrapedData });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to scrape URL' },
      { status: 500 }
    );
  }
}
