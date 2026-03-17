export namespace Time {
  export class Duration {
    public readonly ms: number;

    public constructor(ms: number) {
      this.ms = ms;
    }

    private getParts() {
      const totalSeconds = Math.floor(this.ms / 1000);
      return {
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
      };
    }

    public toISOString() {
      const { days, hours, minutes } = this.getParts();

      return "P" +
        (days ? `${days}D` : "") +
        (hours || minutes ? "T" : "") +
        (hours ? `${hours}H` : "") +
        (minutes ? `${minutes}M` : "");
    }

    public toString() {
      const { days, hours, minutes } = this.getParts();

      const parts = [
        days && `${days} ${days === 1 ? "day" : "days"}`,
        hours && `${hours} ${hours === 1 ? "hour" : "hours"}`,
        minutes && `${minutes} ${minutes === 1 ? "minute" : "minutes"}`,
      ].filter(Boolean) as string[];

      return parts.length > 1
        ? parts.slice(0, -1).join(", ") + " and " + parts.at(-1)
        : parts[0] ?? "0 minutes";
    }
  }

  export class Day {
    public readonly date: Date;

    public constructor(date: Date) {
      this.date = new Date(date.getTime());
      this.date.setHours(0, 0, 0, 0);
    }

    public static today() {
      return new Day(new Date());
    }

    public is(date: Date): boolean;
    public is(day: Day): boolean;
    public is(d: Date | Day): boolean {
      return d instanceof Day
        ? d.date.getTime() === this.date.getTime()
        : new Day(d).date.getTime() === this.date.getTime();
    }

    public toISOString() {
      const year = this.date.getFullYear();
      const month = String(this.date.getMonth() + 1).padStart(2, "0");
      const day = String(this.date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    public toString() {
      return this.date.toLocaleString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    public add(days: number) {
      const newDate = new Date(this.date.getTime());
      newDate.setDate(this.date.getDate() + days);
      return new Day(newDate);
    }

    public subtract(days: number) {
      const newDate = new Date(this.date.getTime());
      newDate.setDate(this.date.getDate() - days);
      return new Day(newDate);
    }

    public next() {
      return this.add(1);
    }

    public previous() {
      return this.subtract(1);
    }

    public getTime() {
      return this.date.getTime();
    }
  }

  export class DateTime {
    public readonly date: Date;

    public constructor(date: Date) {
      this.date = new Date(date.getTime());
    }

    public static now() {
      return new DateTime(new Date());
    }

    public getDay() {
      return new Day(this.date);
    }

    public toISOString() {
      return this.date.toISOString();
    }

    public toString() {
      return this.getDay().toString() + " at " + this.toTimeString();
    }

    public toTimeString() {
      return this.date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric",
      });
    }
  }
}
