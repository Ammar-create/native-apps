import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { fonts, palette, radius } from '../theme';

const FeedbackContext = createContext(null);

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error('useFeedback must be used inside <FeedbackProvider>');
  return context;
}

// ---------- Toast ----------

const TOAST_THEME = {
  success: { icon: 'check-circle', accent: palette.primary, iconColor: palette.primary },
  error: { icon: 'error-outline', accent: palette.error, iconColor: palette.error },
  warning: { icon: 'campaign', accent: palette.tertiary, iconColor: palette.tertiary },
  info: { icon: 'info-outline', accent: palette.secondary, iconColor: palette.secondary }
};

function ToastItem({ toast }) {
  const translateY = useRef(new Animated.Value(-24)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start();
  }, []);

  const theme = TOAST_THEME[toast.type] || TOAST_THEME.info;

  return (
    <Animated.View style={{
      flexDirection: 'row', alignItems: 'center', gap: 10,
      backgroundColor: palette.surfaceContainerHigh,
      borderWidth: 1, borderColor: palette.outlineVariant,
      borderRadius: radius.pill,
      paddingHorizontal: 18, paddingVertical: 12,
      marginBottom: 8,
      shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
      transform: [{ translateY }], opacity
    }}>
      <MaterialIcons name={theme.icon} size={18} color={theme.iconColor} />
      <Text style={{ fontFamily: fonts.monoMedium, fontSize: 12, letterSpacing: 0.5, color: palette.onSurface, maxWidth: 280 }}>{toast.message}</Text>
    </Animated.View>
  );
}

// ---------- Confirm dialog ----------

function ConfirmDialog({ request, onResolve }) {
  const [rendered, setRendered] = useState(null);
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (request) {
      setRendered(request);
      fade.setValue(0); scale.setValue(0.92);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 8, tension: 60, useNativeDriver: true })
      ]).start();
    }
  }, [request]);

  const close = result => {
    Animated.timing(fade, { toValue: 0, duration: 160, useNativeDriver: true }).start(() => {
      setRendered(null);
      if (request) request.resolve(result);
      onResolve();
    });
  };

  if (!rendered) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={() => close(false)}>
      <Animated.View style={{ flex: 1, backgroundColor: 'rgba(10,9,18,0.66)', justifyContent: 'center', padding: 32, opacity: fade }}>
        <Animated.View style={{
          backgroundColor: palette.surface,
          borderWidth: 1, borderColor: 'rgba(72,69,78,0.6)',
          borderRadius: radius.card,
          padding: 22,
          shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 24, elevation: 12,
          transform: [{ scale }]
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: palette.errorContainer, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="delete-outline" size={18} color={palette.onErrorContainer} />
            </View>
            <Text style={{ fontFamily: fonts.displaySemiBold, fontSize: 20, color: palette.onSurface, flex: 1 }}>{rendered.title}</Text>
          </View>
          <Text style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: palette.onSurfaceVariant, marginBottom: 20 }}>{rendered.message}</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              style={({ pressed }) => [{ flex: 1, height: 46, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.surfaceVariant, opacity: pressed ? 0.7 : 1 }]}
              onPress={() => close(false)}
            >
              <Text style={{ fontFamily: fonts.monoMedium, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: palette.onSurfaceVariant }}>Cancel</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [{ flex: 1, height: 46, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.errorContainer, opacity: pressed ? 0.7 : 1 }]}
              onPress={() => close(true)}
            >
              <Text style={{ fontFamily: fonts.monoMedium, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: palette.onErrorContainer }}>{rendered.confirmLabel || 'Delete'}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ---------- Provider ----------

export default function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmRequest, setConfirmRequest] = useState(null);
  const toastId = useRef(0);

  const showToast = useMemo(() => (message, type = 'info') => {
    const id = ++toastId.current;
    setToasts(current => [...current, { id, message, type }]);
    setTimeout(() => setToasts(current => current.filter(toast => toast.id !== id)), 3000);
  }, []);

  const confirm = useMemo(() => options => new Promise(resolve => {
    setConfirmRequest({ resolve, title: options.title || 'Are you sure?', message: options.message || '', confirmLabel: options.confirmLabel || 'Delete' });
  }), []);

  const value = useMemo(() => ({ showToast, confirm }), [showToast, confirm]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <View pointerEvents="none" style={{ position: 'absolute', top: 64, left: 0, right: 0, alignItems: 'center', zIndex: 100 }}>
        {toasts.map(toast => <ToastItem key={toast.id} toast={toast} />)}
      </View>
      <ConfirmDialog request={confirmRequest} onResolve={() => setConfirmRequest(null)} />
    </FeedbackContext.Provider>
  );
}
