/**
 * Hello Tenant Demo Mini-App
 *
 * Story 7.9: Create Demo Tenant Mini-App
 * Story 8.6: Updated to use context-specific capabilities
 *
 * A demo tenant mini-app that exercises the sandbox infrastructure:
 * - In Projects context: Displays editor content stats
 * - In Learn context: Displays lesson content and progress (learn:content:read, learn:progress:read)
 * - In Studio context: Displays lesson draft info (studio:lesson:read)
 *
 * Uses tenant_safe and tenant_elevated capabilities based on context.
 *
 * IMPORTANT: This file uses React.createElement directly instead of JSX
 * to avoid bundling the React JSX runtime, which causes multiple React
 * instance issues in the sandboxed iframe.
 *
 * @see docs/sprint-artifacts/7-9-create-demo-tenant-miniapp.md
 * @see docs/sprint-artifacts/8-6-context-specific-capabilities.md
 */

/**
 * Story 8.2: RuntimeContext type for mini-apps
 *
 * NOTE: This interface is intentionally duplicated from @klynt/miniapp-sdk.
 * The demo-tenant-miniapp is bundled as a standalone JS file and loaded
 * inside the sandboxed iframe. Importing from SDK would bundle SDK code,
 * significantly increasing bundle size and causing duplicate React issues.
 *
 * When updating RuntimeContext in the SDK, also update this copy.
 * @see packages/miniapp-sdk/src/types/index.ts
 */
interface RuntimeContext {
  type: 'projects' | 'studio' | 'learn';
  // Project context fields
  projectId?: string;
  workspaceId?: string;
  // Studio/Learn context fields
  courseId?: string;
  courseSlug?: string;
  lessonId?: string;
  lessonSlug?: string;
  // Studio-specific fields
  isPreview?: boolean;
  isDraft?: boolean;
  // Learn-specific fields
  enrollmentId?: string;
}

/**
 * Learn content response payload (from learn.content.response)
 */
interface LearnContentResponse {
  lessonId: string;
  title: string;
  content: string;
  paneConfigs: unknown[];
}

/**
 * Learn progress response payload (from learn.progress.response)
 */
interface LearnProgressResponse {
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
  data: Record<string, unknown>;
}

/**
 * Studio lesson response payload (from studio.lesson.response)
 */
interface StudioLessonResponse {
  lessonId: string;
  title: string;
  content: string;
  paneConfigs: unknown[];
  isDraft: boolean;
}

// Type declarations for window globals set by sandbox-runtime
declare global {
  interface Window {
    React: typeof import('react');
    __sandboxBridge: {
      getEditorContent(): Promise<string>;
      onEditorChange(callback: (content: string) => void): () => void;
      /** Story 8.2: Get runtime context where mini-app is running */
      useMiniAppContext?(): RuntimeContext;
      /** Emit a message to the host */
      emit(messageType: string, payload: unknown): void;
      /** Subscribe to messages from the host */
      subscribe(messageType: string, handler: (payload: unknown) => void): () => void;
    };
  }
}

/**
 * Styles for the component
 * Using inline styles to keep the bundle small and self-contained
 */
const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1a1a2e',
    color: '#eaeaea',
    boxSizing: 'border-box',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #2d2d44',
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
  },
  badge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: '#22c55e20',
    color: '#22c55e',
    fontFamily: 'monospace',
  },
  contextBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: '#3b82f620',
    color: '#3b82f6',
    fontFamily: 'monospace',
    marginLeft: '8px',
  },
  learnBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: '#8b5cf620',
    color: '#8b5cf6',
    fontFamily: 'monospace',
    marginLeft: '8px',
  },
  studioBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: '#f59e0b20',
    color: '#f59e0b',
    fontFamily: 'monospace',
    marginLeft: '8px',
  },
  stats: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  stat: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#2d2d44',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '11px',
    color: '#8888aa',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  statValueSmall: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  preview: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minHeight: 0,
  },
  previewLabel: {
    fontSize: '11px',
    color: '#8888aa',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  previewContent: {
    flex: 1,
    margin: 0,
    padding: '12px',
    backgroundColor: '#2d2d44',
    borderRadius: '8px',
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#ccccdd',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  footer: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #2d2d44',
    fontSize: '11px',
    color: '#6666aa',
  },
  timestamp: {
    fontSize: '11px',
    color: '#6666aa',
  },
  error: {
    padding: '16px',
    backgroundColor: '#dc262620',
    borderRadius: '8px',
    color: '#dc2626',
    fontSize: '13px',
  },
  loading: {
    padding: '16px',
    backgroundColor: '#3b82f620',
    borderRadius: '8px',
    color: '#3b82f6',
    fontSize: '13px',
    textAlign: 'center',
  },
  section: {
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#8888aa',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  completedBadge: {
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#22c55e20',
    color: '#22c55e',
    display: 'inline-block',
  },
  inProgressBadge: {
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#f59e0b20',
    color: '#f59e0b',
    display: 'inline-block',
  },
  draftBadge: {
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#ef444420',
    color: '#ef4444',
    display: 'inline-block',
  },
};

// =============================================================================
// Projects Context View (original demo behavior)
// =============================================================================

function ProjectsView(): React.ReactElement {
  const React = window.React;
  const h = React.createElement;
  const useState = React.useState;
  const useEffect = React.useEffect;
  const bridge = window.__sandboxBridge;

  const [content, setContent] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bridge
      .getEditorContent()
      .then((initialContent: string) => {
        setContent(initialContent);
        setLastUpdated(new Date());
      })
      .catch((err: Error) => {
        console.error('[HelloTenant] Failed to get initial content:', err);
        setError('Failed to load editor content');
      });

    const unsubscribe = bridge.onEditorChange((newContent: string) => {
      setContent(newContent);
      setLastUpdated(new Date());
    });

    return () => unsubscribe();
  }, []);

  const formatTime = (date: Date | null): string => {
    if (!date) return 'Never';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getPreview = (text: string, maxLength = 100): string => {
    if (text.length <= maxLength) return text || '(empty)';
    return text.slice(0, maxLength) + '...';
  };

  if (error) {
    return h('div', { style: styles.error }, error);
  }

  return h('div', null,
    h('div', { style: styles.stats },
      h('div', { style: styles.stat },
        h('span', { style: styles.statLabel }, 'Characters'),
        h('span', { style: styles.statValue }, content.length.toLocaleString())
      ),
      h('div', { style: styles.stat },
        h('span', { style: styles.statLabel }, 'Lines'),
        h('span', { style: styles.statValue }, content ? content.split('\n').length.toLocaleString() : '0')
      )
    ),
    h('div', { style: styles.preview },
      h('span', { style: styles.previewLabel }, 'Editor Preview'),
      h('pre', { style: styles.previewContent }, getPreview(content))
    ),
    h('div', { style: styles.footer },
      h('span', { style: styles.timestamp }, 'Last updated: ', formatTime(lastUpdated))
    )
  );
}

// =============================================================================
// Learn Context View (Story 8.6)
// =============================================================================

function LearnView({ context }: { context: RuntimeContext }): React.ReactElement {
  const React = window.React;
  const h = React.createElement;
  const useState = React.useState;
  const useEffect = React.useEffect;
  const bridge = window.__sandboxBridge;

  const [lessonContent, setLessonContent] = useState<LearnContentResponse | null>(null);
  const [progress, setProgress] = useState<LearnProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to responses before emitting requests
    const contentUnsub = bridge.subscribe('learn.content.response', (payload: unknown) => {
      setLessonContent(payload as LearnContentResponse);
      setLoading(false);
    });

    const progressUnsub = bridge.subscribe('learn.progress.response', (payload: unknown) => {
      setProgress(payload as LearnProgressResponse);
    });

    // Request lesson content
    try {
      bridge.emit('learn.content.read', { lessonId: context.lessonId });
      bridge.emit('learn.progress.read', { lessonId: context.lessonId });
    } catch (err) {
      console.error('[HelloTenant] Failed to request learn content:', err);
      setError('Failed to load lesson content');
      setLoading(false);
    }

    // Set timeout for loading state
    const timeout = setTimeout(() => {
      if (loading) {
        setError('Timeout waiting for lesson content. Responders may not be active.');
        setLoading(false);
      }
    }, 3000);

    return () => {
      contentUnsub();
      progressUnsub();
      clearTimeout(timeout);
    };
  }, [context.lessonId]);

  if (loading) {
    return h('div', { style: styles.loading }, 'Loading lesson content...');
  }

  if (error) {
    return h('div', { style: styles.error }, error);
  }

  const getContentPreview = (content: string, maxLength = 200): string => {
    if (!content) return '(no content)';
    // Strip markdown headers for preview
    const stripped = content.replace(/^#+\s*/gm, '').trim();
    if (stripped.length <= maxLength) return stripped;
    return stripped.slice(0, maxLength) + '...';
  };

  return h('div', null,
    // Lesson info
    h('div', { style: styles.section },
      h('div', { style: styles.sectionTitle }, 'Lesson'),
      h('div', { style: styles.stat },
        h('span', { style: styles.statLabel }, 'Title'),
        h('span', { style: styles.statValueSmall }, lessonContent?.title || context.lessonSlug || 'Unknown')
      )
    ),

    // Progress status
    h('div', { style: styles.section },
      h('div', { style: styles.sectionTitle }, 'Progress'),
      progress?.completed
        ? h('span', { style: styles.completedBadge }, 'Completed')
        : h('span', { style: styles.inProgressBadge }, 'In Progress'),
      progress?.completedAt && h('span', { style: { ...styles.timestamp, marginLeft: '8px' } },
        'Completed: ', new Date(progress.completedAt).toLocaleDateString()
      )
    ),

    // Content preview
    lessonContent && h('div', { style: styles.preview },
      h('span', { style: styles.previewLabel }, 'Content Preview'),
      h('pre', { style: styles.previewContent }, getContentPreview(lessonContent.content))
    ),

    // Pane count
    h('div', { style: styles.footer },
      h('span', null, 'Panes: ', lessonContent?.paneConfigs?.length ?? 0),
      context.enrollmentId && h('span', { style: { marginLeft: '16px' } },
        'Enrollment: ', context.enrollmentId.slice(0, 8), '...'
      )
    )
  );
}

// =============================================================================
// Studio Context View (Story 8.6)
// =============================================================================

function StudioView({ context }: { context: RuntimeContext }): React.ReactElement {
  const React = window.React;
  const h = React.createElement;
  const useState = React.useState;
  const useEffect = React.useEffect;
  const bridge = window.__sandboxBridge;

  const [lessonData, setLessonData] = useState<StudioLessonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to response before emitting request
    const unsub = bridge.subscribe('studio.lesson.response', (payload: unknown) => {
      setLessonData(payload as StudioLessonResponse);
      setLoading(false);
    });

    // Request lesson data
    try {
      bridge.emit('studio.lesson.read', { lessonId: context.lessonId });
    } catch (err) {
      console.error('[HelloTenant] Failed to request studio lesson:', err);
      setError('Failed to load lesson data');
      setLoading(false);
    }

    // Set timeout for loading state
    const timeout = setTimeout(() => {
      if (loading) {
        setError('Timeout waiting for lesson data. Responders may not be active.');
        setLoading(false);
      }
    }, 3000);

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, [context.lessonId]);

  if (loading) {
    return h('div', { style: styles.loading }, 'Loading lesson draft...');
  }

  if (error) {
    return h('div', { style: styles.error }, error);
  }

  const getContentStats = (content: string): { words: number; chars: number } => {
    const words = content.split(/\s+/).filter(Boolean).length;
    const chars = content.length;
    return { words, chars };
  };

  const stats = getContentStats(lessonData?.content || '');

  return h('div', null,
    // Lesson info with draft status
    h('div', { style: styles.section },
      h('div', { style: styles.sectionTitle }, 'Editing'),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
        h('span', { style: styles.statValueSmall }, lessonData?.title || context.lessonSlug || 'Unknown'),
        lessonData?.isDraft && h('span', { style: styles.draftBadge }, 'Draft')
      )
    ),

    // Content stats
    h('div', { style: styles.stats },
      h('div', { style: styles.stat },
        h('span', { style: styles.statLabel }, 'Words'),
        h('span', { style: styles.statValue }, stats.words.toLocaleString())
      ),
      h('div', { style: styles.stat },
        h('span', { style: styles.statLabel }, 'Characters'),
        h('span', { style: styles.statValue }, stats.chars.toLocaleString())
      )
    ),

    // Pane configs
    h('div', { style: styles.section },
      h('div', { style: styles.sectionTitle }, 'Pane Configurations'),
      h('span', { style: styles.statValueSmall },
        `${lessonData?.paneConfigs?.length ?? 0} pane(s) configured`
      )
    ),

    // Footer
    h('div', { style: styles.footer },
      context.courseSlug && h('span', null, 'Course: ', context.courseSlug),
      context.isPreview && h('span', { style: { marginLeft: '16px', color: '#f59e0b' } }, '(Preview Mode)')
    )
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * HelloTenantApp Component
 *
 * Displays different UI based on the runtime context:
 * - projects: Editor content preview (original behavior)
 * - learn: Lesson content and progress (Story 8.6)
 * - studio: Lesson draft editing info (Story 8.6)
 */
function HelloTenantApp(): React.ReactElement {
  const React = window.React;
  const h = React.createElement;
  const bridge = window.__sandboxBridge;

  // Get runtime context
  const context: RuntimeContext = bridge.useMiniAppContext?.() || { type: 'projects' };

  // Determine context badge style
  const getContextBadgeStyle = (): React.CSSProperties => {
    switch (context.type) {
      case 'learn':
        return styles.learnBadge || styles.contextBadge || {};
      case 'studio':
        return styles.studioBadge || styles.contextBadge || {};
      default:
        return styles.contextBadge || {};
    }
  };

  // Render context-specific view
  const renderContextView = (): React.ReactElement => {
    switch (context.type) {
      case 'learn':
        return h(LearnView, { context });
      case 'studio':
        return h(StudioView, { context });
      default:
        return h(ProjectsView);
    }
  };

  return h('div', { style: styles.container },
    // Header with context badge
    h('div', { style: styles.header },
      h('h3', { style: styles.title }, 'Hello Tenant Demo'),
      h('div', null,
        h('span', { style: styles.badge }, 'tenant'),
        h('span', { style: getContextBadgeStyle() }, context.type)
      )
    ),
    // Context-specific content
    renderContextView()
  );
}

/**
 * Export the tenant mini-app definition
 *
 * Story 8.6: Updated manifest to include context-specific capabilities.
 * The app will only use capabilities appropriate for its runtime context.
 */
export default {
  __type: 'tenant' as const,
  manifest: {
    id: 'hello-tenant',
    name: 'Hello Tenant Demo',
    description: 'Demo tenant mini-app showcasing context-specific capabilities',
    version: '2.0.0',
    category: 'utility',
    // Include all capabilities - the runtime will enforce context-appropriate usage
    capabilities: [
      // Projects context capabilities (original)
      'editor:read',
      'editor:onChange',
      // Learn context capabilities (Story 8.6)
      'learn:content:read',
      'learn:progress:read',
      // Studio context capabilities (Story 8.6)
      'studio:lesson:read',
    ],
    optionalCapabilities: [
      // Optional elevated capabilities for future features
      'learn:progress:update',
      'studio:lesson:write',
    ],
    defaultSize: { width: 320, height: 300 },
    allowMultiple: false,
  },
  component: HelloTenantApp,
  hooks: {
    onActivated: () => {
      console.log('[HelloTenant] Activated - v2.0.0 with context-specific capabilities');
    },
    onDeactivated: (reason: string) => {
      console.log('[HelloTenant] Deactivated:', reason);
    },
  },
};
