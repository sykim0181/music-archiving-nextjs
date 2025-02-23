import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const title = body.title as string;
  const isPublic = body.isPublic as boolean;
  const albumIdList = body.albumIdList as string[];
  const userId = body.userId as string;

  const id = uuidv4();

  const dataToInsert: Database['public']['Tables']['collection-album-list']['Insert'] = {
    id,
    title,
    is_public: isPublic,
    list_album_id: albumIdList,
    user_id: userId
  };
  console.log("The data to insert:", dataToInsert);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('collection-album-list')
      .insert([dataToInsert])
      .select();
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    const collection = data[0];
    console.log("Succeed to insert the data:", collection);
    return NextResponse.json({ collection }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Failed to save the list of the albums');
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}