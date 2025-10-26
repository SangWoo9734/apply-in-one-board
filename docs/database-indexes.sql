-- =====================================================
-- Database Performance Optimization - Indexes
-- =====================================================
-- 이 인덱스들을 Supabase SQL Editor에서 실행하세요
-- 성능 향상: 2-5배 빠른 쿼리 속도

-- 1. user_id 인덱스 (가장 중요)
-- 모든 쿼리가 user_id로 필터링하므로 필수
CREATE INDEX IF NOT EXISTS idx_user_job_tracking_user_id
ON user_job_tracking(user_id);

-- 2. status 인덱스
-- 칸반 보드에서 status별 그룹핑에 사용
CREATE INDEX IF NOT EXISTS idx_user_job_tracking_status
ON user_job_tracking(status);

-- 3. 복합 인덱스: user_id + status
-- WHERE user_id = ? AND status = ? 쿼리 최적화
CREATE INDEX IF NOT EXISTS idx_user_job_tracking_user_status
ON user_job_tracking(user_id, status);

-- 4. created_at 인덱스
-- ORDER BY created_at DESC 정렬 최적화
CREATE INDEX IF NOT EXISTS idx_user_job_tracking_created_at
ON user_job_tracking(created_at DESC);

-- 5. 복합 인덱스: user_id + created_at
-- 사용자별 최신 공고 조회 최적화
CREATE INDEX IF NOT EXISTS idx_user_job_tracking_user_created
ON user_job_tracking(user_id, created_at DESC);

-- 6. deadline 인덱스 (옵션)
-- 마감일 기준 정렬/필터링이 많다면 추가
CREATE INDEX IF NOT EXISTS idx_user_job_tracking_deadline
ON user_job_tracking(deadline)
WHERE deadline IS NOT NULL;

-- 7. profiles 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_profiles_email
ON profiles(email);

-- =====================================================
-- 인덱스 효과 확인
-- =====================================================
-- 실행 전후 쿼리 성능 비교 (EXPLAIN ANALYZE 사용)
--
-- EXPLAIN ANALYZE
-- SELECT * FROM user_job_tracking
-- WHERE user_id = 'your-user-id'
-- ORDER BY created_at DESC;
