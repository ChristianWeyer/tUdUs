using System;
using System.Configuration.Install;
using System.Reflection;
using System.ServiceProcess;

namespace Todo.SelfHost
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main(string[] args)
        {
            var service = new TodoSelfHostService();
            var arguments = string.Concat(args);
            
            switch (arguments)
            {
                case "--console":
                    RunInteractive(service, args);
                    break;
                case "--install":
                    ManagedInstallerClass.InstallHelper(new[] { Assembly.GetExecutingAssembly().Location });
                    break;
                case "--uninstall":
                    ManagedInstallerClass.InstallHelper(new[] { "/u", Assembly.GetExecutingAssembly().Location });
                    break;
                default:
                    ServiceBase.Run(service);
                    break;
            }
        }

        private static void RunInteractive(TodoSelfHostService service, string[] args)
        {
            service.InteractiveStart(args);

            Console.WriteLine("Self-host server running...");
            Console.WriteLine("Press any key to stop.");
            Console.ReadLine();
            
            service.InteractiveStop();
        }
    }
}
