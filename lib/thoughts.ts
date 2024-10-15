import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
} from "firebase/firestore";
import { Thought } from "@/types/thought";

export async function getThoughts(): Promise<Thought[]> {
  const thoughtsCol = collection(db, "thoughts");
  const thoughtSnapshot = await getDocs(thoughtsCol);
  return thoughtSnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Thought)
  );
}

export async function submitThought(
  thought: Omit<Thought, "id" | "votes" | "bgColor" | "createdAt">
): Promise<void> {
  const thoughtsCol = collection(db, "thoughts");
  await addDoc(thoughtsCol, {
    ...thought,
    votes: {
      like: 0,
      heart: 0,
      mind_blown: 0,
      poop: 0,
    },
    bgColor: getRandomColor(),
    createdAt: Timestamp.now(),
  });
}

export async function getFilteredThoughts(
  filter: "hot" | "new" | "top"
): Promise<Thought[]> {
  const thoughtsCol = collection(db, "thoughts");
  let q;

  switch (filter) {
    case "hot":
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      q = query(
        thoughtsCol,
        where("createdAt", ">=", Timestamp.fromDate(sevenDaysAgo)),
        orderBy("createdAt", "desc"),
        limit(100)
      );
      break;
    case "new":
      q = query(thoughtsCol, orderBy("createdAt", "desc"), limit(100));
      break;
    case "top":
      q = query(
        thoughtsCol,
        orderBy("votes.like", "desc"),
        orderBy("votes.heart", "desc"),
        limit(100)
      );
      break;
    default:
      q = query(thoughtsCol, orderBy("createdAt", "desc"));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Thought)
  );
}

export async function voteThought(
  id: string,
  voteType: keyof Thought["votes"] | null,
  previousVote: keyof Thought["votes"] | null
): Promise<void> {
  const thoughtRef = doc(db, "thoughts", id);

  if (previousVote === voteType) {
    // User is un-voting
    await updateDoc(thoughtRef, {
      [`votes.${previousVote}`]: increment(-1),
    });
  } else if (previousVote === null) {
    // User is voting for the first time
    await updateDoc(thoughtRef, {
      [`votes.${voteType}`]: increment(1),
    });
  } else {
    // User is changing their vote
    await updateDoc(thoughtRef, {
      [`votes.${previousVote}`]: increment(-1),
      [`votes.${voteType}`]: increment(1),
    });
  }
}

function getRandomColor(): string {
  const colors = [
    "rgb(11 169 91)",
    "rgb(35 31 32)",
    "rgb(237 32 61)",
    "rgb(243 139 163)",
    "rgb(249 244 218)",
    "rgb(18 181 229)",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function increment(amount: number) {
  return {
    __op: "increment",
    __amount: amount,
  };
}
