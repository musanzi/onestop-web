import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, effect, model, computed } from '@angular/core';
import { EventSkeleton } from '../../components/event-detail-skeleton/event-skeleton';
import {
  LucideAngularModule,
  CalendarDays,
  MapPin,
  Tag,
  ArrowRight,
  CalendarSync,
  Share2,
  ChevronUp,
  Info,
  Hourglass,
  CheckCircle2,
  Users
} from 'lucide-angular';
import { EventStore } from '../../store/event.store';
import { ActivatedRoute } from '@angular/router';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { IEvent, IImage } from '@shared/models/entities.models';
import { GalleryEventStore } from '../../store/galleries.event.store';
import { TranslateModule } from '@ngx-translate/core';
import { formatDateForGoogleCalendarUTC, openExternalUrl } from '@shared/helpers';
import { SeoService } from '@core/services/seo';
import { PublicContainer, PublicSection } from '@shared/public';

@Component({
  selector: 'app-event',
  providers: [EventStore, GalleryEventStore],
  imports: [
    CommonModule,
    EventSkeleton,
    LucideAngularModule,
    ApiImgPipe,
    TranslateModule,
    PublicSection,
    PublicContainer
  ],
  templateUrl: './detail-event.html'
})
export class DetailEvent implements OnInit {
  images = model<IImage[]>([]);
  activeImageIndex = signal(0);
  activeSection = signal<string | null>(null);

  expandedDescription = computed(() => this.activeSection() === 'description');
  expandedObjectives = computed(() => this.activeSection() === 'objectives');
  expandedContext = computed(() => this.activeSection() === 'context');
  expandedSelectionCriteria = computed(() => this.activeSection() === 'selectionCriteria');

  icons = {
    calendarDays: CalendarDays,
    mapPin: MapPin,
    tag: Tag,
    arrow: ArrowRight,
    calendarSync: CalendarSync,
    share: Share2,
    chevronUp: ChevronUp,
    info: Info,
    hourglass: Hourglass,
    checkCircle2: CheckCircle2,
    users: Users
  };

  readonly #route = inject(ActivatedRoute);
  readonly #seo = inject(SeoService);
  readonly store = inject(EventStore);
  readonly galleryStore = inject(GalleryEventStore);

  readonly event = computed(() => this.store.event());

  constructor() {
    effect(() => {
      const gallery = this.galleryStore.images();
      this.images.set(gallery ?? []);
      this.activeImageIndex.set(0);
    });

    effect(() => {
      const event = this.event();
      if (!event?.slug || !event.name) return;
      this.#seo.updateEntityPage({
        name: event.name,
        description: event.description,
        path: `/events/${event.slug}`,
        type: 'event'
      });
    });
  }

  ngOnInit(): void {
    const slug = this.#route.snapshot.params['slug'];
    this.store.loadEvent(slug);
    this.galleryStore.loadGallery(slug);
  }

  getStatut(event: IEvent): string {
    const now = new Date();
    const startedAt = new Date(event.started_at);
    const endedAt = new Date(event.ended_at);
    if (startedAt <= now && endedAt >= now) return 'En cours';
    if (startedAt > now) return 'À venir';
    return 'Terminé';
  }

  private toggleSection(name: string) {
    this.activeSection.set(this.activeSection() === name ? null : name);
  }

  toggleDescription() {
    this.toggleSection('description');
  }

  toggleObjectives() {
    this.toggleSection('objectives');
  }

  toggleContext() {
    this.toggleSection('context');
  }

  toggleSelectionCriteria() {
    this.toggleSection('selectionCriteria');
  }

  openLink(url?: string): void {
    openExternalUrl(url);
  }

  addToCalendar() {
    const event = this.store.event();
    if (!event) return;
    const start = formatDateForGoogleCalendarUTC(event.started_at);
    const end = formatDateForGoogleCalendarUTC(event.ended_at);
    const title = encodeURIComponent(event.name || 'Event');
    const details = encodeURIComponent(event.description?.replace(/\n/g, ' ') || '');
    const location = encodeURIComponent(event.place || '');
    const url = `https://calendar.google.com/calendar/r/eventedit?text=${title}&details=${details}&location=${location}&dates=${start}/${end}`;
    openExternalUrl(url);
  }

  async shareEvent() {
    const event = this.store.event();
    if (!event) return;
    interface LocalShareData {
      title?: string;
      text?: string;
      url?: string;
    }

    const shareData: LocalShareData = {
      title: event.name,
      text: (event.description || '').slice(0, 200),
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    try {
      const nav = navigator as unknown as { share?: (data: LocalShareData) => Promise<void> };
      if (nav.share) {
        await nav.share(shareData);
      } else if (typeof window !== 'undefined') {
        const body = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`);
        window.open(`mailto:?subject=${encodeURIComponent(shareData.title || '')}&body=${body}`, '_blank');
      }
    } catch {
      // ignore (user cancelled or not supported)
    }
  }

  isOngoing(event: IEvent | null | undefined): boolean {
    return !!event && this.getStatut(event) === 'En cours';
  }

  isUpcoming(event: IEvent | null | undefined): boolean {
    return !!event && this.getStatut(event) === 'À venir';
  }

  isPast(event: IEvent | null | undefined): boolean {
    return !!event && this.getStatut(event) === 'Terminé';
  }

  getStatusBadgeClasses(event: IEvent | null | undefined): string {
    if (this.isOngoing(event)) return 'bg-green-50 border-green-100 text-green-700';
    if (this.isUpcoming(event)) return 'bg-amber-50 border-amber-100 text-amber-700';
    return 'bg-gray-100 border-gray-200 text-gray-700';
  }

  getCTAButtonClasses(event: IEvent | null | undefined): string {
    const base = 'rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors duration-200';
    if (this.isOngoing(event)) return base + ' bg-green-600 hover:bg-green-700';
    if (this.isUpcoming(event)) return base + ' bg-brand-600 hover:bg-brand-700';
    return base + ' cursor-not-allowed bg-gray-200 text-gray-600';
  }
}
