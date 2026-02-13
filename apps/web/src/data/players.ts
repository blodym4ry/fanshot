/**
 * FanShot Player Database
 * 200+ players from 48 countries for the FIFA World Cup 2026
 */

export type Position = 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper';

export interface Player {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  team: string;
  position: Position;
  number: number;
  rating: number;
  teamColors: [string, string];
  /** Optional reference photo URL for dual-image AI generation (Wikipedia/Wikimedia) */
  photoUrl?: string;
}

export interface CountryFilter {
  code: string;
  flag: string;
  /** flagcdn.com code — usually lowercase ISO 2-letter, but England/Wales/Scotland differ */
  flagImg: string;
  name: string;
}

export const countries: CountryFilter[] = [
  { code: 'ALL', flag: '🏆', flagImg: '', name: 'All' },
  { code: 'AR', flag: '🇦🇷', flagImg: 'ar', name: 'Argentina' },
  { code: 'BR', flag: '🇧🇷', flagImg: 'br', name: 'Brazil' },
  { code: 'FR', flag: '🇫🇷', flagImg: 'fr', name: 'France' },
  { code: 'DE', flag: '🇩🇪', flagImg: 'de', name: 'Germany' },
  { code: 'ES', flag: '🇪🇸', flagImg: 'es', name: 'Spain' },
  { code: 'GB', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagImg: 'gb-eng', name: 'England' },
  { code: 'PT', flag: '🇵🇹', flagImg: 'pt', name: 'Portugal' },
  { code: 'IT', flag: '🇮🇹', flagImg: 'it', name: 'Italy' },
  { code: 'NL', flag: '🇳🇱', flagImg: 'nl', name: 'Netherlands' },
  { code: 'BE', flag: '🇧🇪', flagImg: 'be', name: 'Belgium' },
  { code: 'HR', flag: '🇭🇷', flagImg: 'hr', name: 'Croatia' },
  { code: 'US', flag: '🇺🇸', flagImg: 'us', name: 'USA' },
  { code: 'MX', flag: '🇲🇽', flagImg: 'mx', name: 'Mexico' },
  { code: 'JP', flag: '🇯🇵', flagImg: 'jp', name: 'Japan' },
  { code: 'KR', flag: '🇰🇷', flagImg: 'kr', name: 'South Korea' },
  { code: 'TR', flag: '🇹🇷', flagImg: 'tr', name: 'Turkey' },
  { code: 'SA', flag: '🇸🇦', flagImg: 'sa', name: 'Saudi Arabia' },
  { code: 'SN', flag: '🇸🇳', flagImg: 'sn', name: 'Senegal' },
  { code: 'NG', flag: '🇳🇬', flagImg: 'ng', name: 'Nigeria' },
  { code: 'AU', flag: '🇦🇺', flagImg: 'au', name: 'Australia' },
  { code: 'UY', flag: '🇺🇾', flagImg: 'uy', name: 'Uruguay' },
  { code: 'CO', flag: '🇨🇴', flagImg: 'co', name: 'Colombia' },
  { code: 'MA', flag: '🇲🇦', flagImg: 'ma', name: 'Morocco' },
  { code: 'CA', flag: '🇨🇦', flagImg: 'ca', name: 'Canada' },
  { code: 'CM', flag: '🇨🇲', flagImg: 'cm', name: 'Cameroon' },
  { code: 'GH', flag: '🇬🇭', flagImg: 'gh', name: 'Ghana' },
  { code: 'CH', flag: '🇨🇭', flagImg: 'ch', name: 'Switzerland' },
  { code: 'DK', flag: '🇩🇰', flagImg: 'dk', name: 'Denmark' },
  { code: 'AT', flag: '🇦🇹', flagImg: 'at', name: 'Austria' },
  { code: 'RS', flag: '🇷🇸', flagImg: 'rs', name: 'Serbia' },
  { code: 'PL', flag: '🇵🇱', flagImg: 'pl', name: 'Poland' },
  { code: 'EC', flag: '🇪🇨', flagImg: 'ec', name: 'Ecuador' },
  { code: 'PY', flag: '🇵🇾', flagImg: 'py', name: 'Paraguay' },
  { code: 'CL', flag: '🇨🇱', flagImg: 'cl', name: 'Chile' },
  { code: 'PE', flag: '🇵🇪', flagImg: 'pe', name: 'Peru' },
  { code: 'VE', flag: '🇻🇪', flagImg: 've', name: 'Venezuela' },
  { code: 'IR', flag: '🇮🇷', flagImg: 'ir', name: 'Iran' },
  { code: 'QA', flag: '🇶🇦', flagImg: 'qa', name: 'Qatar' },
  { code: 'DZ', flag: '🇩🇿', flagImg: 'dz', name: 'Algeria' },
  { code: 'TN', flag: '🇹🇳', flagImg: 'tn', name: 'Tunisia' },
  { code: 'CI', flag: '🇨🇮', flagImg: 'ci', name: 'Ivory Coast' },
  { code: 'WL', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', flagImg: 'gb-wls', name: 'Wales' },
  { code: 'CZ', flag: '🇨🇿', flagImg: 'cz', name: 'Czech Republic' },
  { code: 'UA', flag: '🇺🇦', flagImg: 'ua', name: 'Ukraine' },
  { code: 'SE', flag: '🇸🇪', flagImg: 'se', name: 'Sweden' },
  { code: 'NO', flag: '🇳🇴', flagImg: 'no', name: 'Norway' },
  { code: 'EG', flag: '🇪🇬', flagImg: 'eg', name: 'Egypt' },
];

export const players: Player[] = [
  // ═══ ARGENTINA 🇦🇷 ═══
  { id: 'ar-1', name: 'Lionel Messi', country: 'Argentina', countryCode: 'AR', countryFlag: '🇦🇷', team: 'Inter Miami', position: 'Forward', number: 10, rating: 99, teamColors: ['#75AADB', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg' },
  { id: 'ar-2', name: 'Ángel Di María', country: 'Argentina', countryCode: 'AR', countryFlag: '🇦🇷', team: 'Benfica', position: 'Forward', number: 11, rating: 88, teamColors: ['#75AADB', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/%C3%81ngel_Di_Mar%C3%ADa_in_2022.jpg/440px-%C3%81ngel_Di_Mar%C3%ADa_in_2022.jpg' },
  { id: 'ar-3', name: 'Julián Álvarez', country: 'Argentina', countryCode: 'AR', countryFlag: '🇦🇷', team: 'Atlético Madrid', position: 'Forward', number: 9, rating: 90, teamColors: ['#75AADB', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Juli%C3%A1n_%C3%81lvarez_2023.jpg/440px-Juli%C3%A1n_%C3%81lvarez_2023.jpg' },
  { id: 'ar-4', name: 'Rodrigo De Paul', country: 'Argentina', countryCode: 'AR', countryFlag: '🇦🇷', team: 'Atlético Madrid', position: 'Midfielder', number: 7, rating: 86, teamColors: ['#75AADB', '#FFFFFF'] },
  { id: 'ar-5', name: 'Alexis Mac Allister', country: 'Argentina', countryCode: 'AR', countryFlag: '🇦🇷', team: 'Liverpool', position: 'Midfielder', number: 20, rating: 88, teamColors: ['#75AADB', '#FFFFFF'] },

  // ═══ BRAZIL 🇧🇷 ═══
  { id: 'br-1', name: 'Vinícius Jr', country: 'Brazil', countryCode: 'BR', countryFlag: '🇧🇷', team: 'Real Madrid', position: 'Forward', number: 7, rating: 96, teamColors: ['#009C3B', '#FFDF00'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Vin%C3%ADcius_J%C3%BAnior_2024.jpg/440px-Vin%C3%ADcius_J%C3%BAnior_2024.jpg' },
  { id: 'br-2', name: 'Rodrygo', country: 'Brazil', countryCode: 'BR', countryFlag: '🇧🇷', team: 'Real Madrid', position: 'Forward', number: 11, rating: 89, teamColors: ['#009C3B', '#FFDF00'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Rodrygo_Goes_2023.jpg/440px-Rodrygo_Goes_2023.jpg' },
  { id: 'br-3', name: 'Endrick', country: 'Brazil', countryCode: 'BR', countryFlag: '🇧🇷', team: 'Real Madrid', position: 'Forward', number: 9, rating: 85, teamColors: ['#009C3B', '#FFDF00'] },
  { id: 'br-4', name: 'Casemiro', country: 'Brazil', countryCode: 'BR', countryFlag: '🇧🇷', team: 'Manchester United', position: 'Midfielder', number: 5, rating: 87, teamColors: ['#009C3B', '#FFDF00'] },
  { id: 'br-5', name: 'Marquinhos', country: 'Brazil', countryCode: 'BR', countryFlag: '🇧🇷', team: 'PSG', position: 'Defender', number: 4, rating: 88, teamColors: ['#009C3B', '#FFDF00'] },

  // ═══ FRANCE 🇫🇷 ═══
  { id: 'fr-1', name: 'Kylian Mbappé', country: 'France', countryCode: 'FR', countryFlag: '🇫🇷', team: 'Real Madrid', position: 'Forward', number: 10, rating: 97, teamColors: ['#002395', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28cropped%29.jpg/440px-2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28cropped%29.jpg' },
  { id: 'fr-2', name: 'Antoine Griezmann', country: 'France', countryCode: 'FR', countryFlag: '🇫🇷', team: 'Atlético Madrid', position: 'Forward', number: 7, rating: 89, teamColors: ['#002395', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Antoine_Griezmann_in_2018_%28cropped%29.jpg/440px-Antoine_Griezmann_in_2018_%28cropped%29.jpg' },
  { id: 'fr-3', name: 'Ousmane Dembélé', country: 'France', countryCode: 'FR', countryFlag: '🇫🇷', team: 'PSG', position: 'Forward', number: 11, rating: 88, teamColors: ['#002395', '#FFFFFF'] },
  { id: 'fr-4', name: 'Aurélien Tchouaméni', country: 'France', countryCode: 'FR', countryFlag: '🇫🇷', team: 'Real Madrid', position: 'Midfielder', number: 8, rating: 87, teamColors: ['#002395', '#FFFFFF'] },
  { id: 'fr-5', name: 'William Saliba', country: 'France', countryCode: 'FR', countryFlag: '🇫🇷', team: 'Arsenal', position: 'Defender', number: 2, rating: 88, teamColors: ['#002395', '#FFFFFF'] },

  // ═══ GERMANY 🇩🇪 ═══
  { id: 'de-1', name: 'Jamal Musiala', country: 'Germany', countryCode: 'DE', countryFlag: '🇩🇪', team: 'Bayern Munich', position: 'Midfielder', number: 10, rating: 92, teamColors: ['#000000', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/20221123_AUT_v_GER_Musiala_001.jpg/440px-20221123_AUT_v_GER_Musiala_001.jpg' },
  { id: 'de-2', name: 'Florian Wirtz', country: 'Germany', countryCode: 'DE', countryFlag: '🇩🇪', team: 'Bayer Leverkusen', position: 'Midfielder', number: 17, rating: 91, teamColors: ['#000000', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Florian_Wirtz_2024.jpg/440px-Florian_Wirtz_2024.jpg' },
  { id: 'de-3', name: 'Leroy Sané', country: 'Germany', countryCode: 'DE', countryFlag: '🇩🇪', team: 'Bayern Munich', position: 'Forward', number: 19, rating: 86, teamColors: ['#000000', '#FFFFFF'] },
  { id: 'de-4', name: 'Kai Havertz', country: 'Germany', countryCode: 'DE', countryFlag: '🇩🇪', team: 'Arsenal', position: 'Forward', number: 29, rating: 85, teamColors: ['#000000', '#FFFFFF'] },
  { id: 'de-5', name: 'İlkay Gündoğan', country: 'Germany', countryCode: 'DE', countryFlag: '🇩🇪', team: 'Barcelona', position: 'Midfielder', number: 8, rating: 86, teamColors: ['#000000', '#FFFFFF'] },

  // ═══ SPAIN 🇪🇸 ═══
  { id: 'es-1', name: 'Lamine Yamal', country: 'Spain', countryCode: 'ES', countryFlag: '🇪🇸', team: 'Barcelona', position: 'Forward', number: 19, rating: 93, teamColors: ['#AA151B', '#F1BF00'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Lamine_Yamal.jpg/440px-Lamine_Yamal.jpg' },
  { id: 'es-2', name: 'Pedri', country: 'Spain', countryCode: 'ES', countryFlag: '🇪🇸', team: 'Barcelona', position: 'Midfielder', number: 8, rating: 90, teamColors: ['#AA151B', '#F1BF00'] },
  { id: 'es-3', name: 'Rodri', country: 'Spain', countryCode: 'ES', countryFlag: '🇪🇸', team: 'Manchester City', position: 'Midfielder', number: 16, rating: 93, teamColors: ['#AA151B', '#F1BF00'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Rodri_%28footballer%29_2024.jpg/440px-Rodri_%28footballer%29_2024.jpg' },
  { id: 'es-4', name: 'Álvaro Morata', country: 'Spain', countryCode: 'ES', countryFlag: '🇪🇸', team: 'AC Milan', position: 'Forward', number: 7, rating: 84, teamColors: ['#AA151B', '#F1BF00'] },
  { id: 'es-5', name: 'Dani Carvajal', country: 'Spain', countryCode: 'ES', countryFlag: '🇪🇸', team: 'Real Madrid', position: 'Defender', number: 2, rating: 88, teamColors: ['#AA151B', '#F1BF00'] },

  // ═══ ENGLAND 🏴󠁧󠁢󠁥󠁮󠁧󠁿 ═══
  { id: 'gb-1', name: 'Jude Bellingham', country: 'England', countryCode: 'GB', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Real Madrid', position: 'Midfielder', number: 10, rating: 95, teamColors: ['#FFFFFF', '#CF081F'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Jude_Bellingham_2023.jpg/440px-Jude_Bellingham_2023.jpg' },
  { id: 'gb-2', name: 'Bukayo Saka', country: 'England', countryCode: 'GB', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Arsenal', position: 'Forward', number: 7, rating: 91, teamColors: ['#FFFFFF', '#CF081F'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Bukayo_Saka_2024.jpg/440px-Bukayo_Saka_2024.jpg' },
  { id: 'gb-3', name: 'Phil Foden', country: 'England', countryCode: 'GB', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Manchester City', position: 'Midfielder', number: 11, rating: 90, teamColors: ['#FFFFFF', '#CF081F'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Phil_Foden_2022-11-21.jpg/440px-Phil_Foden_2022-11-21.jpg' },
  { id: 'gb-4', name: 'Declan Rice', country: 'England', countryCode: 'GB', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Arsenal', position: 'Midfielder', number: 4, rating: 89, teamColors: ['#FFFFFF', '#CF081F'] },
  { id: 'gb-5', name: 'Harry Kane', country: 'England', countryCode: 'GB', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Bayern Munich', position: 'Forward', number: 9, rating: 93, teamColors: ['#FFFFFF', '#CF081F'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Harry_Kane_2024.jpg/440px-Harry_Kane_2024.jpg' },

  // ═══ PORTUGAL 🇵🇹 ═══
  { id: 'pt-1', name: 'Cristiano Ronaldo', country: 'Portugal', countryCode: 'PT', countryFlag: '🇵🇹', team: 'Al Nassr', position: 'Forward', number: 7, rating: 95, teamColors: ['#006847', '#FF0000'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/440px-Cristiano_Ronaldo_2018.jpg' },
  { id: 'pt-2', name: 'Bruno Fernandes', country: 'Portugal', countryCode: 'PT', countryFlag: '🇵🇹', team: 'Manchester United', position: 'Midfielder', number: 8, rating: 90, teamColors: ['#006847', '#FF0000'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Bruno_Fernandes_2024.jpg/440px-Bruno_Fernandes_2024.jpg' },
  { id: 'pt-3', name: 'Bernardo Silva', country: 'Portugal', countryCode: 'PT', countryFlag: '🇵🇹', team: 'Manchester City', position: 'Midfielder', number: 10, rating: 90, teamColors: ['#006847', '#FF0000'] },
  { id: 'pt-4', name: 'Rafael Leão', country: 'Portugal', countryCode: 'PT', countryFlag: '🇵🇹', team: 'AC Milan', position: 'Forward', number: 17, rating: 88, teamColors: ['#006847', '#FF0000'] },
  { id: 'pt-5', name: 'Rúben Dias', country: 'Portugal', countryCode: 'PT', countryFlag: '🇵🇹', team: 'Manchester City', position: 'Defender', number: 4, rating: 89, teamColors: ['#006847', '#FF0000'] },

  // ═══ ITALY 🇮🇹 ═══
  { id: 'it-1', name: 'Gianluigi Donnarumma', country: 'Italy', countryCode: 'IT', countryFlag: '🇮🇹', team: 'PSG', position: 'Goalkeeper', number: 1, rating: 88, teamColors: ['#009246', '#0066CC'] },
  { id: 'it-2', name: 'Federico Chiesa', country: 'Italy', countryCode: 'IT', countryFlag: '🇮🇹', team: 'Liverpool', position: 'Forward', number: 14, rating: 85, teamColors: ['#009246', '#0066CC'] },
  { id: 'it-3', name: 'Nicolò Barella', country: 'Italy', countryCode: 'IT', countryFlag: '🇮🇹', team: 'Inter Milan', position: 'Midfielder', number: 23, rating: 89, teamColors: ['#009246', '#0066CC'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Nicol%C3%B2_Barella_2023.jpg/440px-Nicol%C3%B2_Barella_2023.jpg' },
  { id: 'it-4', name: 'Alessandro Bastoni', country: 'Italy', countryCode: 'IT', countryFlag: '🇮🇹', team: 'Inter Milan', position: 'Defender', number: 15, rating: 87, teamColors: ['#009246', '#0066CC'] },
  { id: 'it-5', name: 'Sandro Tonali', country: 'Italy', countryCode: 'IT', countryFlag: '🇮🇹', team: 'Newcastle', position: 'Midfielder', number: 8, rating: 84, teamColors: ['#009246', '#0066CC'] },

  // ═══ NETHERLANDS 🇳🇱 ═══
  { id: 'nl-1', name: 'Virgil van Dijk', country: 'Netherlands', countryCode: 'NL', countryFlag: '🇳🇱', team: 'Liverpool', position: 'Defender', number: 4, rating: 90, teamColors: ['#FF6600', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Virgil_van_Dijk_2023.jpg/440px-Virgil_van_Dijk_2023.jpg' },
  { id: 'nl-2', name: 'Cody Gakpo', country: 'Netherlands', countryCode: 'NL', countryFlag: '🇳🇱', team: 'Liverpool', position: 'Forward', number: 18, rating: 86, teamColors: ['#FF6600', '#FFFFFF'] },
  { id: 'nl-3', name: 'Xavi Simons', country: 'Netherlands', countryCode: 'NL', countryFlag: '🇳🇱', team: 'RB Leipzig', position: 'Midfielder', number: 10, rating: 87, teamColors: ['#FF6600', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Xavi_Simons_2024.jpg/440px-Xavi_Simons_2024.jpg' },
  { id: 'nl-4', name: 'Frenkie de Jong', country: 'Netherlands', countryCode: 'NL', countryFlag: '🇳🇱', team: 'Barcelona', position: 'Midfielder', number: 21, rating: 86, teamColors: ['#FF6600', '#FFFFFF'] },
  { id: 'nl-5', name: 'Denzel Dumfries', country: 'Netherlands', countryCode: 'NL', countryFlag: '🇳🇱', team: 'Inter Milan', position: 'Defender', number: 22, rating: 83, teamColors: ['#FF6600', '#FFFFFF'] },

  // ═══ BELGIUM 🇧🇪 ═══
  { id: 'be-1', name: 'Kevin De Bruyne', country: 'Belgium', countryCode: 'BE', countryFlag: '🇧🇪', team: 'Manchester City', position: 'Midfielder', number: 7, rating: 93, teamColors: ['#ED2939', '#FDDA24'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Kevin_De_Bruyne_2023.jpg/440px-Kevin_De_Bruyne_2023.jpg' },
  { id: 'be-2', name: 'Romelu Lukaku', country: 'Belgium', countryCode: 'BE', countryFlag: '🇧🇪', team: 'Napoli', position: 'Forward', number: 9, rating: 86, teamColors: ['#ED2939', '#FDDA24'] },
  { id: 'be-3', name: 'Jérémy Doku', country: 'Belgium', countryCode: 'BE', countryFlag: '🇧🇪', team: 'Manchester City', position: 'Forward', number: 11, rating: 85, teamColors: ['#ED2939', '#FDDA24'] },
  { id: 'be-4', name: 'Leandro Trossard', country: 'Belgium', countryCode: 'BE', countryFlag: '🇧🇪', team: 'Arsenal', position: 'Forward', number: 19, rating: 84, teamColors: ['#ED2939', '#FDDA24'] },
  { id: 'be-5', name: 'Koen Casteels', country: 'Belgium', countryCode: 'BE', countryFlag: '🇧🇪', team: 'Al-Qadsiah', position: 'Goalkeeper', number: 1, rating: 82, teamColors: ['#ED2939', '#FDDA24'] },

  // ═══ CROATIA 🇭🇷 ═══
  { id: 'hr-1', name: 'Luka Modrić', country: 'Croatia', countryCode: 'HR', countryFlag: '🇭🇷', team: 'Real Madrid', position: 'Midfielder', number: 10, rating: 90, teamColors: ['#FF0000', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/ISL-CRO_%2812%29_%28cropped%29.jpg/440px-ISL-CRO_%2812%29_%28cropped%29.jpg' },
  { id: 'hr-2', name: 'Joško Gvardiol', country: 'Croatia', countryCode: 'HR', countryFlag: '🇭🇷', team: 'Manchester City', position: 'Defender', number: 24, rating: 87, teamColors: ['#FF0000', '#FFFFFF'] },
  { id: 'hr-3', name: 'Mateo Kovačić', country: 'Croatia', countryCode: 'HR', countryFlag: '🇭🇷', team: 'Manchester City', position: 'Midfielder', number: 8, rating: 85, teamColors: ['#FF0000', '#FFFFFF'] },
  { id: 'hr-4', name: 'Andrej Kramarić', country: 'Croatia', countryCode: 'HR', countryFlag: '🇭🇷', team: 'Hoffenheim', position: 'Forward', number: 9, rating: 83, teamColors: ['#FF0000', '#FFFFFF'] },
  { id: 'hr-5', name: 'Marko Livaja', country: 'Croatia', countryCode: 'HR', countryFlag: '🇭🇷', team: 'Hajduk Split', position: 'Forward', number: 14, rating: 80, teamColors: ['#FF0000', '#FFFFFF'] },

  // ═══ USA 🇺🇸 ═══
  { id: 'us-1', name: 'Christian Pulisic', country: 'USA', countryCode: 'US', countryFlag: '🇺🇸', team: 'AC Milan', position: 'Forward', number: 10, rating: 87, teamColors: ['#002868', '#BF0A30'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Christian_Pulisic_2024.jpg/440px-Christian_Pulisic_2024.jpg' },
  { id: 'us-2', name: 'Weston McKennie', country: 'USA', countryCode: 'US', countryFlag: '🇺🇸', team: 'Juventus', position: 'Midfielder', number: 8, rating: 82, teamColors: ['#002868', '#BF0A30'] },
  { id: 'us-3', name: 'Gio Reyna', country: 'USA', countryCode: 'US', countryFlag: '🇺🇸', team: 'Borussia Dortmund', position: 'Midfielder', number: 7, rating: 81, teamColors: ['#002868', '#BF0A30'] },
  { id: 'us-4', name: 'Yunus Musah', country: 'USA', countryCode: 'US', countryFlag: '🇺🇸', team: 'AC Milan', position: 'Midfielder', number: 6, rating: 80, teamColors: ['#002868', '#BF0A30'] },
  { id: 'us-5', name: 'Sergiño Dest', country: 'USA', countryCode: 'US', countryFlag: '🇺🇸', team: 'PSV', position: 'Defender', number: 2, rating: 79, teamColors: ['#002868', '#BF0A30'] },

  // ═══ MEXICO 🇲🇽 ═══
  { id: 'mx-1', name: 'Raúl Jiménez', country: 'Mexico', countryCode: 'MX', countryFlag: '🇲🇽', team: 'Fulham', position: 'Forward', number: 9, rating: 82, teamColors: ['#006847', '#CE1126'] },
  { id: 'mx-2', name: 'Hirving Lozano', country: 'Mexico', countryCode: 'MX', countryFlag: '🇲🇽', team: 'PSV', position: 'Forward', number: 22, rating: 82, teamColors: ['#006847', '#CE1126'] },
  { id: 'mx-3', name: 'Edson Álvarez', country: 'Mexico', countryCode: 'MX', countryFlag: '🇲🇽', team: 'West Ham', position: 'Midfielder', number: 4, rating: 83, teamColors: ['#006847', '#CE1126'] },
  { id: 'mx-4', name: 'Guillermo Ochoa', country: 'Mexico', countryCode: 'MX', countryFlag: '🇲🇽', team: 'Salernitana', position: 'Goalkeeper', number: 13, rating: 79, teamColors: ['#006847', '#CE1126'] },
  { id: 'mx-5', name: 'Jesús Corona', country: 'Mexico', countryCode: 'MX', countryFlag: '🇲🇽', team: 'Cruz Azul', position: 'Forward', number: 17, rating: 78, teamColors: ['#006847', '#CE1126'] },

  // ═══ JAPAN 🇯🇵 ═══
  { id: 'jp-1', name: 'Takefusa Kubo', country: 'Japan', countryCode: 'JP', countryFlag: '🇯🇵', team: 'Real Sociedad', position: 'Forward', number: 11, rating: 85, teamColors: ['#000080', '#FFFFFF'] },
  { id: 'jp-2', name: 'Kaoru Mitoma', country: 'Japan', countryCode: 'JP', countryFlag: '🇯🇵', team: 'Brighton', position: 'Forward', number: 22, rating: 84, teamColors: ['#000080', '#FFFFFF'] },
  { id: 'jp-3', name: 'Daichi Kamada', country: 'Japan', countryCode: 'JP', countryFlag: '🇯🇵', team: 'Crystal Palace', position: 'Midfielder', number: 10, rating: 82, teamColors: ['#000080', '#FFFFFF'] },
  { id: 'jp-4', name: 'Takehiro Tomiyasu', country: 'Japan', countryCode: 'JP', countryFlag: '🇯🇵', team: 'Arsenal', position: 'Defender', number: 18, rating: 82, teamColors: ['#000080', '#FFFFFF'] },
  { id: 'jp-5', name: 'Wataru Endo', country: 'Japan', countryCode: 'JP', countryFlag: '🇯🇵', team: 'Liverpool', position: 'Midfielder', number: 3, rating: 81, teamColors: ['#000080', '#FFFFFF'] },

  // ═══ SOUTH KOREA 🇰🇷 ═══
  { id: 'kr-1', name: 'Son Heung-min', country: 'South Korea', countryCode: 'KR', countryFlag: '🇰🇷', team: 'Tottenham', position: 'Forward', number: 7, rating: 92, teamColors: ['#CD2E3A', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Son_Heung-min_2024.jpg/440px-Son_Heung-min_2024.jpg' },
  { id: 'kr-2', name: 'Kim Min-jae', country: 'South Korea', countryCode: 'KR', countryFlag: '🇰🇷', team: 'Bayern Munich', position: 'Defender', number: 3, rating: 87, teamColors: ['#CD2E3A', '#FFFFFF'] },
  { id: 'kr-3', name: 'Lee Kang-in', country: 'South Korea', countryCode: 'KR', countryFlag: '🇰🇷', team: 'PSG', position: 'Midfielder', number: 10, rating: 84, teamColors: ['#CD2E3A', '#FFFFFF'] },
  { id: 'kr-4', name: 'Hwang Hee-chan', country: 'South Korea', countryCode: 'KR', countryFlag: '🇰🇷', team: 'Wolverhampton', position: 'Forward', number: 11, rating: 82, teamColors: ['#CD2E3A', '#FFFFFF'] },
  { id: 'kr-5', name: 'Cho Gue-sung', country: 'South Korea', countryCode: 'KR', countryFlag: '🇰🇷', team: 'Midtjylland', position: 'Forward', number: 9, rating: 79, teamColors: ['#CD2E3A', '#FFFFFF'] },

  // ═══ TURKEY 🇹🇷 ═══
  { id: 'tr-1', name: 'Hakan Çalhanoğlu', country: 'Turkey', countryCode: 'TR', countryFlag: '🇹🇷', team: 'Inter Milan', position: 'Midfielder', number: 10, rating: 88, teamColors: ['#E30A17', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/20180610_FIFA_Friendly_Match_Austria_vs._Brazil_Hakan_%C3%87alhano%C4%9Flu_850_1691_%28cropped%29.jpg/440px-20180610_FIFA_Friendly_Match_Austria_vs._Brazil_Hakan_%C3%87alhano%C4%9Flu_850_1691_%28cropped%29.jpg' },
  { id: 'tr-2', name: 'Kenan Yıldız', country: 'Turkey', countryCode: 'TR', countryFlag: '🇹🇷', team: 'Juventus', position: 'Forward', number: 10, rating: 84, teamColors: ['#E30A17', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Kenan_Y%C4%B1ld%C4%B1z_2024.jpg/440px-Kenan_Y%C4%B1ld%C4%B1z_2024.jpg' },
  { id: 'tr-3', name: 'Arda Güler', country: 'Turkey', countryCode: 'TR', countryFlag: '🇹🇷', team: 'Real Madrid', position: 'Midfielder', number: 15, rating: 85, teamColors: ['#E30A17', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Arda_G%C3%BCler_2024.jpg/440px-Arda_G%C3%BCler_2024.jpg' },
  { id: 'tr-4', name: 'Barış Alper Yılmaz', country: 'Turkey', countryCode: 'TR', countryFlag: '🇹🇷', team: 'Galatasaray', position: 'Forward', number: 17, rating: 81, teamColors: ['#E30A17', '#FFFFFF'] },
  { id: 'tr-5', name: 'Kerem Aktürkoğlu', country: 'Turkey', countryCode: 'TR', countryFlag: '🇹🇷', team: 'Galatasaray', position: 'Forward', number: 7, rating: 82, teamColors: ['#E30A17', '#FFFFFF'] },

  // ═══ SAUDI ARABIA 🇸🇦 ═══
  { id: 'sa-1', name: 'Salem Al-Dawsari', country: 'Saudi Arabia', countryCode: 'SA', countryFlag: '🇸🇦', team: 'Al Hilal', position: 'Forward', number: 10, rating: 82, teamColors: ['#006C35', '#FFFFFF'] },
  { id: 'sa-2', name: 'Yasser Al-Shahrani', country: 'Saudi Arabia', countryCode: 'SA', countryFlag: '🇸🇦', team: 'Al Hilal', position: 'Defender', number: 13, rating: 79, teamColors: ['#006C35', '#FFFFFF'] },
  { id: 'sa-3', name: 'Mohamed Kanno', country: 'Saudi Arabia', countryCode: 'SA', countryFlag: '🇸🇦', team: 'Al Hilal', position: 'Midfielder', number: 8, rating: 78, teamColors: ['#006C35', '#FFFFFF'] },
  { id: 'sa-4', name: 'Firas Al-Buraikan', country: 'Saudi Arabia', countryCode: 'SA', countryFlag: '🇸🇦', team: 'Al Ahli', position: 'Forward', number: 7, rating: 77, teamColors: ['#006C35', '#FFFFFF'] },
  { id: 'sa-5', name: 'Mohammed Al-Owais', country: 'Saudi Arabia', countryCode: 'SA', countryFlag: '🇸🇦', team: 'Al Hilal', position: 'Goalkeeper', number: 1, rating: 78, teamColors: ['#006C35', '#FFFFFF'] },

  // ═══ SENEGAL 🇸🇳 ═══
  { id: 'sn-1', name: 'Sadio Mané', country: 'Senegal', countryCode: 'SN', countryFlag: '🇸🇳', team: 'Al Nassr', position: 'Forward', number: 10, rating: 87, teamColors: ['#00853F', '#FDEF42'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Sadio_Man%C3%A9_2018.jpg/440px-Sadio_Man%C3%A9_2018.jpg' },
  { id: 'sn-2', name: 'Kalidou Koulibaly', country: 'Senegal', countryCode: 'SN', countryFlag: '🇸🇳', team: 'Al Hilal', position: 'Defender', number: 3, rating: 84, teamColors: ['#00853F', '#FDEF42'] },
  { id: 'sn-3', name: 'Édouard Mendy', country: 'Senegal', countryCode: 'SN', countryFlag: '🇸🇳', team: 'Al Ahli', position: 'Goalkeeper', number: 16, rating: 83, teamColors: ['#00853F', '#FDEF42'] },
  { id: 'sn-4', name: 'Abdou Diallo', country: 'Senegal', countryCode: 'SN', countryFlag: '🇸🇳', team: 'Lyon', position: 'Defender', number: 4, rating: 79, teamColors: ['#00853F', '#FDEF42'] },
  { id: 'sn-5', name: 'Boulaye Dia', country: 'Senegal', countryCode: 'SN', countryFlag: '🇸🇳', team: 'Lazio', position: 'Forward', number: 9, rating: 80, teamColors: ['#00853F', '#FDEF42'] },

  // ═══ NIGERIA 🇳🇬 ═══
  { id: 'ng-1', name: 'Victor Osimhen', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬', team: 'Napoli', position: 'Forward', number: 9, rating: 90, teamColors: ['#008751', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Victor_Osimhen_2023.jpg/440px-Victor_Osimhen_2023.jpg' },
  { id: 'ng-2', name: 'Alex Iwobi', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬', team: 'Fulham', position: 'Midfielder', number: 17, rating: 81, teamColors: ['#008751', '#FFFFFF'] },
  { id: 'ng-3', name: 'Wilfred Ndidi', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬', team: 'Leicester', position: 'Midfielder', number: 25, rating: 82, teamColors: ['#008751', '#FFFFFF'] },
  { id: 'ng-4', name: 'Ademola Lookman', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬', team: 'Atalanta', position: 'Forward', number: 11, rating: 85, teamColors: ['#008751', '#FFFFFF'] },
  { id: 'ng-5', name: 'William Ekong', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬', team: 'Watford', position: 'Defender', number: 5, rating: 77, teamColors: ['#008751', '#FFFFFF'] },

  // ═══ AUSTRALIA 🇦🇺 ═══
  { id: 'au-1', name: 'Ajdin Hrustic', country: 'Australia', countryCode: 'AU', countryFlag: '🇦🇺', team: 'Hellas Verona', position: 'Midfielder', number: 10, rating: 76, teamColors: ['#00843D', '#FFCD00'] },
  { id: 'au-2', name: 'Mitchell Duke', country: 'Australia', countryCode: 'AU', countryFlag: '🇦🇺', team: 'Machida Zelvia', position: 'Forward', number: 13, rating: 74, teamColors: ['#00843D', '#FFCD00'] },
  { id: 'au-3', name: 'Riley McGree', country: 'Australia', countryCode: 'AU', countryFlag: '🇦🇺', team: 'Middlesbrough', position: 'Midfielder', number: 8, rating: 75, teamColors: ['#00843D', '#FFCD00'] },
  { id: 'au-4', name: 'Harry Souttar', country: 'Australia', countryCode: 'AU', countryFlag: '🇦🇺', team: 'Leicester', position: 'Defender', number: 6, rating: 76, teamColors: ['#00843D', '#FFCD00'] },
  { id: 'au-5', name: 'Mathew Ryan', country: 'Australia', countryCode: 'AU', countryFlag: '🇦🇺', team: 'Roma', position: 'Goalkeeper', number: 1, rating: 76, teamColors: ['#00843D', '#FFCD00'] },

  // ═══ URUGUAY 🇺🇾 ═══
  { id: 'uy-1', name: 'Luis Suárez', country: 'Uruguay', countryCode: 'UY', countryFlag: '🇺🇾', team: 'Inter Miami', position: 'Forward', number: 9, rating: 85, teamColors: ['#001489', '#75AADB'] },
  { id: 'uy-2', name: 'Federico Valverde', country: 'Uruguay', countryCode: 'UY', countryFlag: '🇺🇾', team: 'Real Madrid', position: 'Midfielder', number: 15, rating: 91, teamColors: ['#001489', '#75AADB'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Federico_Valverde_2023.jpg/440px-Federico_Valverde_2023.jpg' },
  { id: 'uy-3', name: 'Darwin Núñez', country: 'Uruguay', countryCode: 'UY', countryFlag: '🇺🇾', team: 'Liverpool', position: 'Forward', number: 9, rating: 87, teamColors: ['#001489', '#75AADB'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Darwin_N%C3%BA%C3%B1ez_2023.jpg/440px-Darwin_N%C3%BA%C3%B1ez_2023.jpg' },
  { id: 'uy-4', name: 'Ronald Araújo', country: 'Uruguay', countryCode: 'UY', countryFlag: '🇺🇾', team: 'Barcelona', position: 'Defender', number: 4, rating: 87, teamColors: ['#001489', '#75AADB'] },
  { id: 'uy-5', name: 'Rodrigo Bentancur', country: 'Uruguay', countryCode: 'UY', countryFlag: '🇺🇾', team: 'Tottenham', position: 'Midfielder', number: 30, rating: 82, teamColors: ['#001489', '#75AADB'] },

  // ═══ COLOMBIA 🇨🇴 ═══
  { id: 'co-1', name: 'James Rodríguez', country: 'Colombia', countryCode: 'CO', countryFlag: '🇨🇴', team: 'São Paulo', position: 'Midfielder', number: 10, rating: 83, teamColors: ['#FCD116', '#003893'] },
  { id: 'co-2', name: 'Luis Díaz', country: 'Colombia', countryCode: 'CO', countryFlag: '🇨🇴', team: 'Liverpool', position: 'Forward', number: 7, rating: 87, teamColors: ['#FCD116', '#003893'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Luis_D%C3%ADaz_2024.jpg/440px-Luis_D%C3%ADaz_2024.jpg' },
  { id: 'co-3', name: 'Santiago Arias', country: 'Colombia', countryCode: 'CO', countryFlag: '🇨🇴', team: 'Bayer Leverkusen', position: 'Defender', number: 4, rating: 79, teamColors: ['#FCD116', '#003893'] },
  { id: 'co-4', name: 'Dávinson Sánchez', country: 'Colombia', countryCode: 'CO', countryFlag: '🇨🇴', team: 'Galatasaray', position: 'Defender', number: 6, rating: 80, teamColors: ['#FCD116', '#003893'] },
  { id: 'co-5', name: 'Yerry Mina', country: 'Colombia', countryCode: 'CO', countryFlag: '🇨🇴', team: 'Cagliari', position: 'Defender', number: 13, rating: 79, teamColors: ['#FCD116', '#003893'] },

  // ═══ MOROCCO 🇲🇦 ═══
  { id: 'ma-1', name: 'Achraf Hakimi', country: 'Morocco', countryCode: 'MA', countryFlag: '🇲🇦', team: 'PSG', position: 'Defender', number: 2, rating: 89, teamColors: ['#C1272D', '#006233'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Achraf_Hakimi_2022.jpg/440px-Achraf_Hakimi_2022.jpg' },
  { id: 'ma-2', name: 'Hakim Ziyech', country: 'Morocco', countryCode: 'MA', countryFlag: '🇲🇦', team: 'Galatasaray', position: 'Midfielder', number: 10, rating: 83, teamColors: ['#C1272D', '#006233'] },
  { id: 'ma-3', name: 'Sofyan Amrabat', country: 'Morocco', countryCode: 'MA', countryFlag: '🇲🇦', team: 'Fiorentina', position: 'Midfielder', number: 4, rating: 82, teamColors: ['#C1272D', '#006233'] },
  { id: 'ma-4', name: 'Youssef En-Nesyri', country: 'Morocco', countryCode: 'MA', countryFlag: '🇲🇦', team: 'Sevilla', position: 'Forward', number: 19, rating: 81, teamColors: ['#C1272D', '#006233'] },
  { id: 'ma-5', name: 'Yassine Bounou', country: 'Morocco', countryCode: 'MA', countryFlag: '🇲🇦', team: 'Al Hilal', position: 'Goalkeeper', number: 1, rating: 84, teamColors: ['#C1272D', '#006233'] },

  // ═══ CANADA 🇨🇦 ═══
  { id: 'ca-1', name: 'Alphonso Davies', country: 'Canada', countryCode: 'CA', countryFlag: '🇨🇦', team: 'Bayern Munich', position: 'Defender', number: 19, rating: 86, teamColors: ['#FF0000', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Alphonso_Davies_2024.jpg/440px-Alphonso_Davies_2024.jpg' },
  { id: 'ca-2', name: 'Jonathan David', country: 'Canada', countryCode: 'CA', countryFlag: '🇨🇦', team: 'Lille', position: 'Forward', number: 9, rating: 84, teamColors: ['#FF0000', '#FFFFFF'] },
  { id: 'ca-3', name: 'Tajon Buchanan', country: 'Canada', countryCode: 'CA', countryFlag: '🇨🇦', team: 'Inter Milan', position: 'Midfielder', number: 11, rating: 78, teamColors: ['#FF0000', '#FFFFFF'] },
  { id: 'ca-4', name: 'Cyle Larin', country: 'Canada', countryCode: 'CA', countryFlag: '🇨🇦', team: 'Mallorca', position: 'Forward', number: 17, rating: 77, teamColors: ['#FF0000', '#FFFFFF'] },
  { id: 'ca-5', name: 'Stephen Eustáquio', country: 'Canada', countryCode: 'CA', countryFlag: '🇨🇦', team: 'Porto', position: 'Midfielder', number: 7, rating: 79, teamColors: ['#FF0000', '#FFFFFF'] },

  // ═══ CAMEROON 🇨🇲 ═══
  { id: 'cm-1', name: 'André Onana', country: 'Cameroon', countryCode: 'CM', countryFlag: '🇨🇲', team: 'Manchester United', position: 'Goalkeeper', number: 24, rating: 84, teamColors: ['#007A5E', '#CE1126'] },
  { id: 'cm-2', name: 'Bryan Mbeumo', country: 'Cameroon', countryCode: 'CM', countryFlag: '🇨🇲', team: 'Brentford', position: 'Forward', number: 19, rating: 83, teamColors: ['#007A5E', '#CE1126'] },
  { id: 'cm-3', name: 'André-Frank Zambo Anguissa', country: 'Cameroon', countryCode: 'CM', countryFlag: '🇨🇲', team: 'Napoli', position: 'Midfielder', number: 99, rating: 84, teamColors: ['#007A5E', '#CE1126'] },
  { id: 'cm-4', name: 'Karl Toko Ekambi', country: 'Cameroon', countryCode: 'CM', countryFlag: '🇨🇲', team: 'Lyon', position: 'Forward', number: 7, rating: 79, teamColors: ['#007A5E', '#CE1126'] },
  { id: 'cm-5', name: 'Nicolas Nkoulou', country: 'Cameroon', countryCode: 'CM', countryFlag: '🇨🇲', team: 'Aris Thessaloniki', position: 'Defender', number: 5, rating: 76, teamColors: ['#007A5E', '#CE1126'] },

  // ═══ GHANA 🇬🇭 ═══
  { id: 'gh-1', name: 'Mohammed Kudus', country: 'Ghana', countryCode: 'GH', countryFlag: '🇬🇭', team: 'West Ham', position: 'Midfielder', number: 14, rating: 84, teamColors: ['#006B3F', '#FCD116'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Mohammed_Kudus_2023.jpg/440px-Mohammed_Kudus_2023.jpg' },
  { id: 'gh-2', name: 'Thomas Partey', country: 'Ghana', countryCode: 'GH', countryFlag: '🇬🇭', team: 'Arsenal', position: 'Midfielder', number: 5, rating: 84, teamColors: ['#006B3F', '#FCD116'] },
  { id: 'gh-3', name: 'Iñaki Williams', country: 'Ghana', countryCode: 'GH', countryFlag: '🇬🇭', team: 'Athletic Bilbao', position: 'Forward', number: 9, rating: 82, teamColors: ['#006B3F', '#FCD116'] },
  { id: 'gh-4', name: 'André Ayew', country: 'Ghana', countryCode: 'GH', countryFlag: '🇬🇭', team: 'Le Havre', position: 'Forward', number: 10, rating: 76, teamColors: ['#006B3F', '#FCD116'] },
  { id: 'gh-5', name: 'Daniel Amartey', country: 'Ghana', countryCode: 'GH', countryFlag: '🇬🇭', team: 'Besiktas', position: 'Defender', number: 4, rating: 75, teamColors: ['#006B3F', '#FCD116'] },

  // ═══ SWITZERLAND 🇨🇭 ═══
  { id: 'ch-1', name: 'Granit Xhaka', country: 'Switzerland', countryCode: 'CH', countryFlag: '🇨🇭', team: 'Bayer Leverkusen', position: 'Midfielder', number: 10, rating: 86, teamColors: ['#FF0000', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Granit_Xhaka_2024.jpg/440px-Granit_Xhaka_2024.jpg' },
  { id: 'ch-2', name: 'Xherdan Shaqiri', country: 'Switzerland', countryCode: 'CH', countryFlag: '🇨🇭', team: 'Chicago Fire', position: 'Forward', number: 23, rating: 78, teamColors: ['#FF0000', '#FFFFFF'] },
  { id: 'ch-3', name: 'Manuel Akanji', country: 'Switzerland', countryCode: 'CH', countryFlag: '🇨🇭', team: 'Manchester City', position: 'Defender', number: 25, rating: 85, teamColors: ['#FF0000', '#FFFFFF'] },
  { id: 'ch-4', name: 'Breel Embolo', country: 'Switzerland', countryCode: 'CH', countryFlag: '🇨🇭', team: 'Monaco', position: 'Forward', number: 7, rating: 79, teamColors: ['#FF0000', '#FFFFFF'] },
  { id: 'ch-5', name: 'Yann Sommer', country: 'Switzerland', countryCode: 'CH', countryFlag: '🇨🇭', team: 'Inter Milan', position: 'Goalkeeper', number: 1, rating: 85, teamColors: ['#FF0000', '#FFFFFF'] },

  // ═══ DENMARK 🇩🇰 ═══
  { id: 'dk-1', name: 'Christian Eriksen', country: 'Denmark', countryCode: 'DK', countryFlag: '🇩🇰', team: 'Manchester United', position: 'Midfielder', number: 14, rating: 83, teamColors: ['#C60C30', '#FFFFFF'] },
  { id: 'dk-2', name: 'Rasmus Højlund', country: 'Denmark', countryCode: 'DK', countryFlag: '🇩🇰', team: 'Manchester United', position: 'Forward', number: 11, rating: 83, teamColors: ['#C60C30', '#FFFFFF'] },
  { id: 'dk-3', name: 'Morten Hjulmand', country: 'Denmark', countryCode: 'DK', countryFlag: '🇩🇰', team: 'Sporting CP', position: 'Midfielder', number: 23, rating: 81, teamColors: ['#C60C30', '#FFFFFF'] },
  { id: 'dk-4', name: 'Andreas Christensen', country: 'Denmark', countryCode: 'DK', countryFlag: '🇩🇰', team: 'Barcelona', position: 'Defender', number: 15, rating: 82, teamColors: ['#C60C30', '#FFFFFF'] },
  { id: 'dk-5', name: 'Kasper Schmeichel', country: 'Denmark', countryCode: 'DK', countryFlag: '🇩🇰', team: 'Anderlecht', position: 'Goalkeeper', number: 1, rating: 80, teamColors: ['#C60C30', '#FFFFFF'] },

  // ═══ AUSTRIA 🇦🇹 ═══
  { id: 'at-1', name: 'David Alaba', country: 'Austria', countryCode: 'AT', countryFlag: '🇦🇹', team: 'Real Madrid', position: 'Defender', number: 4, rating: 86, teamColors: ['#ED2939', '#FFFFFF'] },
  { id: 'at-2', name: 'Marko Arnautović', country: 'Austria', countryCode: 'AT', countryFlag: '🇦🇹', team: 'Inter Milan', position: 'Forward', number: 8, rating: 78, teamColors: ['#ED2939', '#FFFFFF'] },
  { id: 'at-3', name: 'Konrad Laimer', country: 'Austria', countryCode: 'AT', countryFlag: '🇦🇹', team: 'Bayern Munich', position: 'Midfielder', number: 27, rating: 81, teamColors: ['#ED2939', '#FFFFFF'] },
  { id: 'at-4', name: 'Marcel Sabitzer', country: 'Austria', countryCode: 'AT', countryFlag: '🇦🇹', team: 'Borussia Dortmund', position: 'Midfielder', number: 7, rating: 81, teamColors: ['#ED2939', '#FFFFFF'] },
  { id: 'at-5', name: 'Patrick Pentz', country: 'Austria', countryCode: 'AT', countryFlag: '🇦🇹', team: 'Brøndby', position: 'Goalkeeper', number: 1, rating: 75, teamColors: ['#ED2939', '#FFFFFF'] },

  // ═══ SERBIA 🇷🇸 ═══
  { id: 'rs-1', name: 'Dušan Vlahović', country: 'Serbia', countryCode: 'RS', countryFlag: '🇷🇸', team: 'Juventus', position: 'Forward', number: 9, rating: 86, teamColors: ['#C6363C', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Du%C5%A1an_Vlahovi%C4%87_2024.jpg/440px-Du%C5%A1an_Vlahovi%C4%87_2024.jpg' },
  { id: 'rs-2', name: 'Sergej Milinković-Savić', country: 'Serbia', countryCode: 'RS', countryFlag: '🇷🇸', team: 'Al Hilal', position: 'Midfielder', number: 21, rating: 84, teamColors: ['#C6363C', '#FFFFFF'] },
  { id: 'rs-3', name: 'Dušan Tadić', country: 'Serbia', countryCode: 'RS', countryFlag: '🇷🇸', team: 'Fenerbahçe', position: 'Midfielder', number: 10, rating: 82, teamColors: ['#C6363C', '#FFFFFF'] },
  { id: 'rs-4', name: 'Filip Kostić', country: 'Serbia', countryCode: 'RS', countryFlag: '🇷🇸', team: 'Juventus', position: 'Midfielder', number: 17, rating: 80, teamColors: ['#C6363C', '#FFFFFF'] },
  { id: 'rs-5', name: 'Strahinja Pavlović', country: 'Serbia', countryCode: 'RS', countryFlag: '🇷🇸', team: 'AC Milan', position: 'Defender', number: 31, rating: 80, teamColors: ['#C6363C', '#FFFFFF'] },

  // ═══ POLAND 🇵🇱 ═══
  { id: 'pl-1', name: 'Robert Lewandowski', country: 'Poland', countryCode: 'PL', countryFlag: '🇵🇱', team: 'Barcelona', position: 'Forward', number: 9, rating: 91, teamColors: ['#DC143C', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Robert_Lewandowski%2C_FC_Bayern_M%C3%BCnchen_%28by_Sven_Mandel%2C_2019-05-27%29_02_%28cropped%29.jpg/440px-Robert_Lewandowski%2C_FC_Bayern_M%C3%BCnchen_%28by_Sven_Mandel%2C_2019-05-27%29_02_%28cropped%29.jpg' },
  { id: 'pl-2', name: 'Piotr Zieliński', country: 'Poland', countryCode: 'PL', countryFlag: '🇵🇱', team: 'Inter Milan', position: 'Midfielder', number: 20, rating: 83, teamColors: ['#DC143C', '#FFFFFF'] },
  { id: 'pl-3', name: 'Wojciech Szczęsny', country: 'Poland', countryCode: 'PL', countryFlag: '🇵🇱', team: 'Barcelona', position: 'Goalkeeper', number: 1, rating: 84, teamColors: ['#DC143C', '#FFFFFF'] },
  { id: 'pl-4', name: 'Arkadiusz Milik', country: 'Poland', countryCode: 'PL', countryFlag: '🇵🇱', team: 'Juventus', position: 'Forward', number: 7, rating: 79, teamColors: ['#DC143C', '#FFFFFF'] },
  { id: 'pl-5', name: 'Jakub Kiwior', country: 'Poland', countryCode: 'PL', countryFlag: '🇵🇱', team: 'Arsenal', position: 'Defender', number: 15, rating: 79, teamColors: ['#DC143C', '#FFFFFF'] },

  // ═══ ECUADOR 🇪🇨 ═══
  { id: 'ec-1', name: 'Enner Valencia', country: 'Ecuador', countryCode: 'EC', countryFlag: '🇪🇨', team: 'Internacional', position: 'Forward', number: 13, rating: 80, teamColors: ['#FFD100', '#003DA5'] },
  { id: 'ec-2', name: 'Moisés Caicedo', country: 'Ecuador', countryCode: 'EC', countryFlag: '🇪🇨', team: 'Chelsea', position: 'Midfielder', number: 25, rating: 85, teamColors: ['#FFD100', '#003DA5'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mois%C3%A9s_Caicedo_2023.jpg/440px-Mois%C3%A9s_Caicedo_2023.jpg' },
  { id: 'ec-3', name: 'Kendry Páez', country: 'Ecuador', countryCode: 'EC', countryFlag: '🇪🇨', team: 'Independiente', position: 'Midfielder', number: 10, rating: 79, teamColors: ['#FFD100', '#003DA5'] },
  { id: 'ec-4', name: 'Piero Hincapié', country: 'Ecuador', countryCode: 'EC', countryFlag: '🇪🇨', team: 'Bayer Leverkusen', position: 'Defender', number: 3, rating: 82, teamColors: ['#FFD100', '#003DA5'] },
  { id: 'ec-5', name: 'Alexander Domínguez', country: 'Ecuador', countryCode: 'EC', countryFlag: '🇪🇨', team: 'Liga de Quito', position: 'Goalkeeper', number: 22, rating: 76, teamColors: ['#FFD100', '#003DA5'] },

  // ═══ PARAGUAY 🇵🇾 ═══
  { id: 'py-1', name: 'Miguel Almirón', country: 'Paraguay', countryCode: 'PY', countryFlag: '🇵🇾', team: 'Newcastle', position: 'Forward', number: 24, rating: 81, teamColors: ['#D52B1E', '#FFFFFF'] },
  { id: 'py-2', name: 'Julio Enciso', country: 'Paraguay', countryCode: 'PY', countryFlag: '🇵🇾', team: 'Brighton', position: 'Forward', number: 30, rating: 78, teamColors: ['#D52B1E', '#FFFFFF'] },
  { id: 'py-3', name: 'Antonio Sanabria', country: 'Paraguay', countryCode: 'PY', countryFlag: '🇵🇾', team: 'Torino', position: 'Forward', number: 9, rating: 78, teamColors: ['#D52B1E', '#FFFFFF'] },
  { id: 'py-4', name: 'Gustavo Gómez', country: 'Paraguay', countryCode: 'PY', countryFlag: '🇵🇾', team: 'Palmeiras', position: 'Defender', number: 15, rating: 79, teamColors: ['#D52B1E', '#FFFFFF'] },
  { id: 'py-5', name: 'Fabián Balbuena', country: 'Paraguay', countryCode: 'PY', countryFlag: '🇵🇾', team: 'Corinthians', position: 'Defender', number: 4, rating: 77, teamColors: ['#D52B1E', '#FFFFFF'] },

  // ═══ CHILE 🇨🇱 ═══
  { id: 'cl-1', name: 'Alexis Sánchez', country: 'Chile', countryCode: 'CL', countryFlag: '🇨🇱', team: 'Udinese', position: 'Forward', number: 7, rating: 82, teamColors: ['#D52B1E', '#FFFFFF'] },
  { id: 'cl-2', name: 'Arturo Vidal', country: 'Chile', countryCode: 'CL', countryFlag: '🇨🇱', team: 'Colo-Colo', position: 'Midfielder', number: 8, rating: 78, teamColors: ['#D52B1E', '#FFFFFF'] },
  { id: 'cl-3', name: 'Darío Osorio', country: 'Chile', countryCode: 'CL', countryFlag: '🇨🇱', team: 'Midtjylland', position: 'Forward', number: 11, rating: 76, teamColors: ['#D52B1E', '#FFFFFF'] },
  { id: 'cl-4', name: 'Marcelino Núñez', country: 'Chile', countryCode: 'CL', countryFlag: '🇨🇱', team: 'Norwich', position: 'Midfielder', number: 24, rating: 77, teamColors: ['#D52B1E', '#FFFFFF'] },
  { id: 'cl-5', name: 'Claudio Bravo', country: 'Chile', countryCode: 'CL', countryFlag: '🇨🇱', team: 'Real Betis', position: 'Goalkeeper', number: 1, rating: 77, teamColors: ['#D52B1E', '#FFFFFF'] },

  // ═══ PERU 🇵🇪 ═══
  { id: 'pe-1', name: 'André Carrillo', country: 'Peru', countryCode: 'PE', countryFlag: '🇵🇪', team: 'Al Qadisiyah', position: 'Forward', number: 18, rating: 76, teamColors: ['#D91023', '#FFFFFF'] },
  { id: 'pe-2', name: 'Gianluca Lapadula', country: 'Peru', countryCode: 'PE', countryFlag: '🇵🇪', team: 'Cagliari', position: 'Forward', number: 9, rating: 77, teamColors: ['#D91023', '#FFFFFF'] },
  { id: 'pe-3', name: 'Renato Tapia', country: 'Peru', countryCode: 'PE', countryFlag: '🇵🇪', team: 'Celta Vigo', position: 'Midfielder', number: 13, rating: 76, teamColors: ['#D91023', '#FFFFFF'] },

  // ═══ VENEZUELA 🇻🇪 ═══
  { id: 've-1', name: 'Salomón Rondón', country: 'Venezuela', countryCode: 'VE', countryFlag: '🇻🇪', team: 'Pachuca', position: 'Forward', number: 23, rating: 76, teamColors: ['#CF142B', '#00247D'] },
  { id: 've-2', name: 'Yeferson Soteldo', country: 'Venezuela', countryCode: 'VE', countryFlag: '🇻🇪', team: 'Santos', position: 'Forward', number: 10, rating: 76, teamColors: ['#CF142B', '#00247D'] },
  { id: 've-3', name: 'Yangel Herrera', country: 'Venezuela', countryCode: 'VE', countryFlag: '🇻🇪', team: 'Girona', position: 'Midfielder', number: 6, rating: 78, teamColors: ['#CF142B', '#00247D'] },

  // ═══ IRAN 🇮🇷 ═══
  { id: 'ir-1', name: 'Mehdi Taremi', country: 'Iran', countryCode: 'IR', countryFlag: '🇮🇷', team: 'Inter Milan', position: 'Forward', number: 9, rating: 83, teamColors: ['#239F40', '#DA0000'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Mehdi_Taremi_2022.jpg/440px-Mehdi_Taremi_2022.jpg' },
  { id: 'ir-2', name: 'Sardar Azmoun', country: 'Iran', countryCode: 'IR', countryFlag: '🇮🇷', team: 'Roma', position: 'Forward', number: 11, rating: 80, teamColors: ['#239F40', '#DA0000'] },
  { id: 'ir-3', name: 'Alireza Jahanbakhsh', country: 'Iran', countryCode: 'IR', countryFlag: '🇮🇷', team: 'Feyenoord', position: 'Forward', number: 7, rating: 77, teamColors: ['#239F40', '#DA0000'] },

  // ═══ QATAR 🇶🇦 ═══
  { id: 'qa-1', name: 'Akram Afif', country: 'Qatar', countryCode: 'QA', countryFlag: '🇶🇦', team: 'Al Sadd', position: 'Forward', number: 11, rating: 79, teamColors: ['#8B1A1A', '#FFFFFF'] },
  { id: 'qa-2', name: 'Almoez Ali', country: 'Qatar', countryCode: 'QA', countryFlag: '🇶🇦', team: 'Al Duhail', position: 'Forward', number: 19, rating: 77, teamColors: ['#8B1A1A', '#FFFFFF'] },
  { id: 'qa-3', name: 'Hassan Al-Haydos', country: 'Qatar', countryCode: 'QA', countryFlag: '🇶🇦', team: 'Al Sadd', position: 'Midfielder', number: 10, rating: 76, teamColors: ['#8B1A1A', '#FFFFFF'] },

  // ═══ ALGERIA 🇩🇿 ═══
  { id: 'dz-1', name: 'Riyad Mahrez', country: 'Algeria', countryCode: 'DZ', countryFlag: '🇩🇿', team: 'Al Ahli', position: 'Forward', number: 7, rating: 84, teamColors: ['#006233', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Riyad_Mahrez_2019.jpg/440px-Riyad_Mahrez_2019.jpg' },
  { id: 'dz-2', name: 'Ismaël Bennacer', country: 'Algeria', countryCode: 'DZ', countryFlag: '🇩🇿', team: 'AC Milan', position: 'Midfielder', number: 4, rating: 82, teamColors: ['#006233', '#FFFFFF'] },
  { id: 'dz-3', name: 'Saïd Benrahma', country: 'Algeria', countryCode: 'DZ', countryFlag: '🇩🇿', team: 'Lyon', position: 'Forward', number: 22, rating: 80, teamColors: ['#006233', '#FFFFFF'] },

  // ═══ TUNISIA 🇹🇳 ═══
  { id: 'tn-1', name: 'Youssef Msakni', country: 'Tunisia', countryCode: 'TN', countryFlag: '🇹🇳', team: 'Al Arabi', position: 'Forward', number: 7, rating: 78, teamColors: ['#E70013', '#FFFFFF'] },
  { id: 'tn-2', name: 'Hannibal Mejbri', country: 'Tunisia', countryCode: 'TN', countryFlag: '🇹🇳', team: 'Manchester United', position: 'Midfielder', number: 46, rating: 76, teamColors: ['#E70013', '#FFFFFF'] },
  { id: 'tn-3', name: 'Aïssa Laïdouni', country: 'Tunisia', countryCode: 'TN', countryFlag: '🇹🇳', team: 'Union Berlin', position: 'Midfielder', number: 8, rating: 77, teamColors: ['#E70013', '#FFFFFF'] },

  // ═══ IVORY COAST 🇨🇮 ═══
  { id: 'ci-1', name: 'Sébastien Haller', country: 'Ivory Coast', countryCode: 'CI', countryFlag: '🇨🇮', team: 'Borussia Dortmund', position: 'Forward', number: 9, rating: 80, teamColors: ['#FF8200', '#FFFFFF'] },
  { id: 'ci-2', name: 'Franck Kessié', country: 'Ivory Coast', countryCode: 'CI', countryFlag: '🇨🇮', team: 'Al Ahli', position: 'Midfielder', number: 8, rating: 80, teamColors: ['#FF8200', '#FFFFFF'] },
  { id: 'ci-3', name: 'Nicolas Pépé', country: 'Ivory Coast', countryCode: 'CI', countryFlag: '🇨🇮', team: 'Trabzonspor', position: 'Forward', number: 7, rating: 78, teamColors: ['#FF8200', '#FFFFFF'] },

  // ═══ WALES 🏴󠁧󠁢󠁷󠁬󠁳󠁿 ═══
  { id: 'wl-1', name: 'Gareth Bale', country: 'Wales', countryCode: 'WL', countryFlag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', team: 'Retired', position: 'Forward', number: 11, rating: 82, teamColors: ['#D4213D', '#00A94F'] },
  { id: 'wl-2', name: 'Aaron Ramsey', country: 'Wales', countryCode: 'WL', countryFlag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', team: 'Cardiff', position: 'Midfielder', number: 10, rating: 77, teamColors: ['#D4213D', '#00A94F'] },
  { id: 'wl-3', name: 'Daniel James', country: 'Wales', countryCode: 'WL', countryFlag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', team: 'Leeds', position: 'Forward', number: 20, rating: 76, teamColors: ['#D4213D', '#00A94F'] },

  // ═══ CZECH REPUBLIC 🇨🇿 ═══
  { id: 'cz-1', name: 'Patrik Schick', country: 'Czech Republic', countryCode: 'CZ', countryFlag: '🇨🇿', team: 'Bayer Leverkusen', position: 'Forward', number: 14, rating: 82, teamColors: ['#D7141A', '#11457E'] },
  { id: 'cz-2', name: 'Tomáš Souček', country: 'Czech Republic', countryCode: 'CZ', countryFlag: '🇨🇿', team: 'West Ham', position: 'Midfielder', number: 28, rating: 81, teamColors: ['#D7141A', '#11457E'] },
  { id: 'cz-3', name: 'Adam Hložek', country: 'Czech Republic', countryCode: 'CZ', countryFlag: '🇨🇿', team: 'Bayer Leverkusen', position: 'Forward', number: 21, rating: 79, teamColors: ['#D7141A', '#11457E'] },

  // ═══ UKRAINE 🇺🇦 ═══
  { id: 'ua-1', name: 'Mykhailo Mudryk', country: 'Ukraine', countryCode: 'UA', countryFlag: '🇺🇦', team: 'Chelsea', position: 'Forward', number: 10, rating: 80, teamColors: ['#005BBB', '#FFD500'] },
  { id: 'ua-2', name: 'Oleksandr Zinchenko', country: 'Ukraine', countryCode: 'UA', countryFlag: '🇺🇦', team: 'Arsenal', position: 'Defender', number: 35, rating: 82, teamColors: ['#005BBB', '#FFD500'] },
  { id: 'ua-3', name: 'Andriy Lunin', country: 'Ukraine', countryCode: 'UA', countryFlag: '🇺🇦', team: 'Real Madrid', position: 'Goalkeeper', number: 13, rating: 81, teamColors: ['#005BBB', '#FFD500'] },

  // ═══ SWEDEN 🇸🇪 ═══
  { id: 'se-1', name: 'Alexander Isak', country: 'Sweden', countryCode: 'SE', countryFlag: '🇸🇪', team: 'Newcastle', position: 'Forward', number: 14, rating: 86, teamColors: ['#006AA7', '#FECC00'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Alexander_Isak_2024.jpg/440px-Alexander_Isak_2024.jpg' },
  { id: 'se-2', name: 'Dejan Kulusevski', country: 'Sweden', countryCode: 'SE', countryFlag: '🇸🇪', team: 'Tottenham', position: 'Forward', number: 21, rating: 84, teamColors: ['#006AA7', '#FECC00'] },
  { id: 'se-3', name: 'Viktor Gyökeres', country: 'Sweden', countryCode: 'SE', countryFlag: '🇸🇪', team: 'Sporting CP', position: 'Forward', number: 9, rating: 86, teamColors: ['#006AA7', '#FECC00'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Viktor_Gy%C3%B6keres_2024.jpg/440px-Viktor_Gy%C3%B6keres_2024.jpg' },

  // ═══ NORWAY 🇳🇴 ═══
  { id: 'no-1', name: 'Erling Haaland', country: 'Norway', countryCode: 'NO', countryFlag: '🇳🇴', team: 'Manchester City', position: 'Forward', number: 9, rating: 96, teamColors: ['#BA0C2F', '#00205B'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Erling_Haaland_2023.jpg/440px-Erling_Haaland_2023.jpg' },
  { id: 'no-2', name: 'Martin Ødegaard', country: 'Norway', countryCode: 'NO', countryFlag: '🇳🇴', team: 'Arsenal', position: 'Midfielder', number: 8, rating: 90, teamColors: ['#BA0C2F', '#00205B'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Martin_%C3%98degaard_2023.jpg/440px-Martin_%C3%98degaard_2023.jpg' },
  { id: 'no-3', name: 'Sander Berge', country: 'Norway', countryCode: 'NO', countryFlag: '🇳🇴', team: 'Burnley', position: 'Midfielder', number: 6, rating: 79, teamColors: ['#BA0C2F', '#00205B'] },

  // ═══ EGYPT 🇪🇬 ═══
  { id: 'eg-1', name: 'Mohamed Salah', country: 'Egypt', countryCode: 'EG', countryFlag: '🇪🇬', team: 'Liverpool', position: 'Forward', number: 11, rating: 93, teamColors: ['#CE1126', '#FFFFFF'], photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mohamed_Salah_2018.jpg/440px-Mohamed_Salah_2018.jpg' },
  { id: 'eg-2', name: 'Mohamed Elneny', country: 'Egypt', countryCode: 'EG', countryFlag: '🇪🇬', team: 'Arsenal', position: 'Midfielder', number: 25, rating: 76, teamColors: ['#CE1126', '#FFFFFF'] },
  { id: 'eg-3', name: 'Trézéguet', country: 'Egypt', countryCode: 'EG', countryFlag: '🇪🇬', team: 'Trabzonspor', position: 'Forward', number: 17, rating: 77, teamColors: ['#CE1126', '#FFFFFF'] },
];
