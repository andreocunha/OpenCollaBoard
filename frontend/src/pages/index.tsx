import { CardBoard } from '@/components/CardBoard';
import { socket } from '@/services/socket';
import styles from '@/styles/Home.module.css'
import { getTextAlert } from '@/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react'
import { HeadTab } from '../components/HeadTab';

export default function Home() {
  const [rooms, setRooms] = useState<{ id: string, title: string, createdAt: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    socket.on('allRooms', (rooms) => {
      setRooms(rooms);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className={styles.container}>
      <HeadTab title="Home" />
      
      <header className={styles.header}>
        <h1>OpenCollaBoard</h1>

        <button 
          className={styles.button}
          onClick={async () => {
            const roomTitle = await getTextAlert()
            if(roomTitle) socket.emit('createRoom', `${Date.now()}`, roomTitle);
          }}
        >Novo board
        </button>
      </header>

      <main className={styles.main}>
        {isLoading ? (
          [0, 1, 2, 3].map((i) => (
            <CardBoard key={i} />
          ))
        ) : (
          rooms.map((room, index) => (
            <CardBoard 
              key={index} 
              onClick={() => window.location.href = `/room/${room.id}`}
              title={room.title}
              createdAt={room.createdAt}
            />
          ))
        )}
      </main>
    </div>
  );
}