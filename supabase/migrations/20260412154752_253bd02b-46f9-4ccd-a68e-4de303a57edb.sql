
-- Allow authenticated users to view all orders (admin)
CREATE POLICY "Authenticated users can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update any order status (admin)
CREATE POLICY "Authenticated users can update order status"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to view all feedback (admin)
CREATE POLICY "Authenticated users can view all feedback"
  ON public.feedback FOR SELECT
  TO authenticated
  USING (true);
