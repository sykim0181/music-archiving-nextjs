import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { Collection } from "@/types/common";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const title = body.title as string;
  const isPublic = body.isPublic as boolean;
  const albumIdList = body.albumIdList as string[];
  const userId = body.userId as string;

  const id = uuidv4();

  const dataToInsert: Database["public"]["Tables"]["collection-album-list"]["Insert"] =
    {
      id,
      title,
      is_public: isPublic,
      list_album_id: albumIdList,
      user_id: userId,
    };
  console.log("The data to insert:", dataToInsert);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("collection-album-list")
      .insert([dataToInsert])
      .select();
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    const collection = data[0];
    console.log("Succeed to insert the data:", collection);
    return NextResponse.json({ collection }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to save the list of the albums");
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const collectionId = searchParams.get("id");

  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();

  if (userRes.error) {
    console.log(userRes.error);
    const { message, code } = userRes.error;
    const error = new Error(`Failed to get User: ${message} (${code})`);
    return NextResponse.json({ error }, { status: 500 });
  }
  const userId = userRes.data.user.id;

  // collection 조회
  const collectionRes = await supabase
    .from("collection-album-list")
    .select()
    .eq("id", collectionId);
  if (collectionRes.error) {
    console.log(collectionRes.error);
    const { message, code } = collectionRes.error;
    const error = new Error(`Failed to get Collection: ${message} (${code})`);
    return NextResponse.json({ error }, { status: 500 });
  }

  if (collectionRes.data.length === 0) {
    const error = new Error(`Collection not existed`);
    return NextResponse.json({ error }, { status: 500 });
  }

  // user id 비교
  const collection = collectionRes.data[0] as Collection;
  const collectionUserId = collection.user_id;
  if (userId !== collectionUserId) {
    const error = new Error(`Not authorized to delete`);
    return NextResponse.json({ error }, { status: 500 });
  }

  // 삭제
  const res = await supabase
    .from("collection-album-list")
    .delete()
    .eq("id", collectionId);
  if (res.error) {
    console.log(res.error);
    const { message, code } = res.error;
    const error = new Error(`Failed to delete: ${message} (${code})`);
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({}, { status: 200 });
}
