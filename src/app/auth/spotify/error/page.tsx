import MainLayout from "@/layouts/MainLayout";

const MESSAGE = {
  ["provider_email_needs_verification"]:
    "스포티파이 계정에 등록된 이메일 주소로 확인 이메일이 전송되었습니다. 이메일에 포함된 링크를 클릭하여 로그인을 완료해주세요.",
  ["auth_code_error"]: "인증 실패. 나중에 다시 시도하세요.",
} as const;

type ErrorCode = keyof typeof MESSAGE;

const UNKNOWN_ERROR_MSG = "알 수 없는 에러. 나중에 다시 시도하세요.";

const Page = async ({
  params,
}: {
  params: Promise<{ error_code: string }>;
}) => {
  const { error_code } = await params;

  const isDefinedErrorCode = (code: string): code is ErrorCode =>
    code in MESSAGE;

  const msg = isDefinedErrorCode(error_code)
    ? MESSAGE[error_code]
    : UNKNOWN_ERROR_MSG;

  return (
    <MainLayout>
      <div className="center_screen">
        <p>{msg}</p>
      </div>
    </MainLayout>
  );
};

export default Page;
