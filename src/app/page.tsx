import { connection } from "next/server";
import { Suspense } from "react";
import { getPrisma } from "@/lib/prisma";

export default function HomePage() {
  return (
    <main>
      <p className="mark">ProStore</p>
      <h1>Заметки</h1>
      <p className="lead">
        Список читается из PostgreSQL (Neon) при открытии страницы.
      </p>
      <Suspense fallback={<p className="loading">Загрузка заметок…</p>}>
        <NoteList />
      </Suspense>
    </main>
  );
}

async function NoteList() {
  await connection();
  const notes = await loadNotes();

  if (notes === null) {
    return (
      <p className="error" role="alert">
        Не удалось прочитать заметки. Проверьте DATABASE_URL и что миграция
        применена.
      </p>
    );
  }

  if (notes.length === 0) {
    return <p className="empty">В базе пока нет заметок.</p>;
  }

  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>
          <span>{note.title}</span>
          <time dateTime={note.createdAt.toISOString()}>
            {note.createdAt.toLocaleString("ru-RU", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </time>
        </li>
      ))}
    </ul>
  );
}

async function loadNotes() {
  try {
    return await getPrisma().note.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
