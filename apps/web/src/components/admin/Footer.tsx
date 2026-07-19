export function AdminFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full sm:p-6 p-3">
      <div className="bg-white dark:bg-[#191B1F] w-full py-4 sm:px-6 px-3 rounded-md border border-default">
        <div className="flex items-center sm:justify-between justify-center sm:flex-row flex-col text-[#64748b] dark:text-[#9ca3af]">
          <p className="sm:mb-0 text-xs md:text-sm sm:text-start text-center">
            COPYRIGHT © {currentYear} diceymio.com. All rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
