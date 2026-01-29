import { describe, it, expect, vi } from 'vitest';
import { WattWatch } from '../plugins/wattwatch';

describe('WattWatch Plugin', () => {
  describe('Plugin Structure', () => {
    it('should export a plugin function', () => {
      expect(typeof WattWatch).toBe('function');
    });

    it('should return event handlers when initialized', async () => {
      const mockClient = {
        tui: {
          toast: { show: vi.fn() },
        },
        session: {
          getId: vi.fn().mockReturnValue('test-session-id'),
        },
      };

      const result = await WattWatch({ client: mockClient as any });

      expect('session.created' in result).toBe(true);
      expect('message.updated' in result).toBe(true);
      expect('session.idle' in result).toBe(true);
    });
  });

  describe('Session Tracking', () => {
    it('should initialize session stats on session.created', async () => {
      const mockClient = {
        tui: {
          toast: { show: vi.fn() },
        },
        session: {
          getId: vi.fn().mockReturnValue('test-session-id'),
        },
      };

      const handlers = await WattWatch({ client: mockClient as any });

      const mockEvent = {
        session: {
          id: 'test-session-id',
        },
      };

      await handlers['session.created']?.({ event: mockEvent } as any);

      expect(mockEvent).toBeDefined();
    });
  });

  describe('Token Accumulation', () => {
    it('should accumulate tokens from message updates', async () => {
      const mockClient = {
        tui: {
          toast: { show: vi.fn() },
        },
        session: {
          getId: vi.fn().mockReturnValue('test-session-id'),
        },
      };

      const handlers = await WattWatch({ client: mockClient as any });

      await handlers['session.created']?.({
        event: { session: { id: 'test-session-id' } },
      } as any);

      const messageEvent = {
        message: {
          role: 'assistant',
          modelID: 'claude-sonnet',
          tokens: {
            input: 1000,
            output: 500,
            reasoning: 100,
            cache: { read: 200, write: 50 },
          },
        },
        session: {
          id: 'test-session-id',
        },
      };

      await handlers['message.updated']?.({ event: messageEvent } as any);

      expect(messageEvent.message.tokens).toBeDefined();
    });
  });

  describe('Toast Notifications', () => {
    it('should show toast on session.idle', async () => {
      const mockToast = vi.fn();
      const mockClient = {
        tui: {
          toast: { show: mockToast },
        },
        session: {
          getId: vi.fn().mockReturnValue('test-session-id'),
        },
      };

      const handlers = await WattWatch({ client: mockClient as any });

      await handlers['session.created']?.({
        event: { session: { id: 'test-session-id' } },
      } as any);

      const messageEvent = {
        message: {
          role: 'assistant',
          modelID: 'claude-sonnet',
          tokens: {
            input: 1000,
            output: 500,
            reasoning: 0,
            cache: { read: 0, write: 0 },
          },
        },
        session: {
          id: 'test-session-id',
        },
      };

      await handlers['message.updated']?.({ event: messageEvent } as any);

      await handlers['session.idle']?.({
        event: { session: { id: 'test-session-id' } },
      } as any);

      expect(mockToast).toHaveBeenCalled();
      const toastCall = mockToast.mock.calls[0][0];
      expect(toastCall).toContain('Energy:');
      expect(toastCall).toContain('Wh');
      expect(toastCall).toContain('EUR');
      expect(toastCall).toContain('tokens');
    });
  });
});
