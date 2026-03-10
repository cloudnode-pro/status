import { SiteComponent } from "./SiteComponent";
import { SiteLink } from "./SiteLink";

export interface Site {
  id: string;
  name: { default: string };
  subdomain: string;
  websiteUrl: string;
  logoUrl: string;
  logoUrlDark: string;
  faviconUrl: string;
  status: string;
  mainStatus: string;
  components: SiteComponent[];
  links: {
    header: SiteLink[];
    footerLeft: SiteLink[];
    footerRight: SiteLink[];
  };
}
