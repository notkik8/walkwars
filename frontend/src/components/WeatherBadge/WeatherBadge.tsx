import { useEffect, useState } from "react";

type CurrentWeather = {
  time: string;
  temperature: number;
  windspeed: number;
  weathercode: number;
};

function iconByCode(code: number) {
  if (code === 0) return "☀️";
  if ([1, 2, 3].includes(code)) return "⛅";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌡️";
}

export default function WeatherBadge() {
  const [cw, setCw] = useState<CurrentWeather | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      try {
        setErr(null);

        const url =
          "https://api.open-meteo.com/v1/forecast" +
          "?latitude=55.7569&longitude=37.6151&current_weather=true&timezone=auto";

        const r = await fetch(url, { signal: ac.signal });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);

        const data = await r.json();
        setCw(data.current_weather);
      } catch (e: any) {
        if (e?.name !== "AbortError") setErr(String(e));
      }
    }

    load();
    const t = setInterval(load, 10 * 60 * 1000); // обновлять раз в 10 минут

    return () => {
      ac.abort();
      clearInterval(t);
    };
  }, []);

  if (err) return <div className="weather-badge">Weather: --</div>;
  if (!cw) return <div className="weather-badge">Weather: ...</div>;

  return (
    <div className="weather-badge" title={cw.time}>
      <span className="weather-ico">{iconByCode(cw.weathercode)}</span>
      <span>{Math.round(cw.temperature)}°C</span>
      <span className="weather-wind">{Math.round(cw.windspeed)} m/s</span>
    </div>
  );
}
