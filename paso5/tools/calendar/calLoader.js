import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import ical from 'ical';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
const url = process.env.CALENDAR_URL;

export async function getCalendarEvents() {
  const response = await fetch(url);
  const icalData = await response.text();
  const cal = ical.parseICS(icalData);

  const events = [];
  for (const key in cal) {
    const component = cal[key];
    if (component.type === 'VEVENT') {
      events.push({
        summary: component.summary,
        start: component.start,
        end: component.end,
        location: component.location,
      });
    }
  }
  return events;
}




