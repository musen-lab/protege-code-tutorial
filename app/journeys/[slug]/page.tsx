import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPage } from "@/app/components/LessonPage";
import { getLesson, lessons } from "@/app/lib/course";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  return lesson
    ? { title: lesson.title, description: lesson.summary }
    : { title: "Lesson not found" };
}

export default async function JourneyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return <LessonPage lesson={lesson} />;
}
