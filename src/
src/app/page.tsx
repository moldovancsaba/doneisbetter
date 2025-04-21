export const initialCards: Card[] = [
  {
    id: 'card-1',
    content: 'Take out the trash',
    createdAt: '2025-04-21T08:00:00',
    position: { x: 400, y: 250 },
  },
  {
    id: 'card-2',
    content: 'Finish lesson plan',
    createdAt: '2025-04-21T12:00:00',
    position: { x: 600, y: 400 },
  },
];
      {/* CardCanvas or your new canvas component goes here: */}
      <CardCanvas cards={cards} />
      {/* Placeholder to show the state is wired */}
      {/* <pre>{JSON.stringify(cards, null, 2)}</pre> */}
    </main>
  );
}
  const [cards, setCards] = useState<Card[]>(initialCards);
  return (
    <main>
      <CardCanvas cards={cards} onCardsChange={setCards} />
    </main>
  );
}
