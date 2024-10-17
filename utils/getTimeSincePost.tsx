export const getTimeSincePost = (dateString: string) => {
    const postDate = new Date(dateString);
    const now = new Date();
    const differenceInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    const intervals = [
      { label: 'ano', seconds: 31536000 },
      { label: 'mês', seconds: 2592000 },
      { label: 'dia', seconds: 86400 },
      { label: 'hora', seconds: 3600 },
      { label: 'minuto', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(differenceInSeconds / interval.seconds);
      if (count > 1) return `${count} ${interval.label}s atrás`;
      if (count === 1) return `${count} ${interval.label} atrás`;
    }

    return 'Agora mesmo';
  };