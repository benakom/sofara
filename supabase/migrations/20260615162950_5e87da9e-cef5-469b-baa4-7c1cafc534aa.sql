
DROP POLICY IF EXISTS "Users can delete own kyc documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own kyc documents" ON storage.objects;

CREATE POLICY "Users can delete own kyc documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'kyc-documents'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own kyc documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'kyc-documents'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'kyc-documents'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );
