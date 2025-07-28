import { processCheckout } from '../checkoutService';
import { userRequest } from '../../requestMethods';

// Mock the request method
vi.mock('../../requestMethods', () => ({
  userRequest: {
    post: vi.fn()
  }
}));

describe('Checkout Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process checkout successfully', async () => {
    const mockResponse = { data: { success: true, orderId: 'order123' } };
    userRequest.post.mockResolvedValue(mockResponse);

    const checkoutData = {
      userId: 'user123',
      address: { street: '123 Main St' },
      tokenId: 'tok_123'
    };

    const result = await processCheckout(checkoutData);

    expect(userRequest.post).toHaveBeenCalledWith('/checkout', checkoutData);
    expect(result.success).toBe(true);
    expect(result.orderId).toBe('order123');
  });

  it('should handle checkout errors', async () => {
    const mockError = {
      response: { data: { error: 'Payment failed' } }
    };
    userRequest.post.mockRejectedValue(mockError);

    const checkoutData = {
      userId: 'user123',
      address: { street: '123 Main St' },
      tokenId: 'tok_123'
    };

    await expect(processCheckout(checkoutData)).rejects.toThrow('Payment failed');
  });
});