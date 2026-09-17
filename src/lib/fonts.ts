import { useFonts } from 'expo-font';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold';
import { IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono/500Medium';
import { InstrumentSans_400Regular } from '@expo-google-fonts/instrument-sans/400Regular';
import { InstrumentSans_500Medium } from '@expo-google-fonts/instrument-sans/500Medium';
import { InstrumentSans_600SemiBold } from '@expo-google-fonts/instrument-sans/600SemiBold';
import { SairaExtraCondensed_800ExtraBold } from '@expo-google-fonts/saira-extra-condensed/800ExtraBold';

export function useAppFonts() {
  return useFonts({
    Fraunces: Fraunces_600SemiBold,
    InstrumentSans: InstrumentSans_400Regular,
    InstrumentSansMedium: InstrumentSans_500Medium,
    InstrumentSansSemiBold: InstrumentSans_600SemiBold,
    SairaExtraCondensed: SairaExtraCondensed_800ExtraBold,
    IBMPlexMono: IBMPlexMono_500Medium,
  });
}
