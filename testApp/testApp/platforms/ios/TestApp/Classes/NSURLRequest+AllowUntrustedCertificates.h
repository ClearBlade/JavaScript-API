//
//  NSURLRequest+AllowUntrustedCertificates.h
//  ClearConcert
//
//  Created by Andy Joslin on 3/15/13.
//
//

#import <Foundation/Foundation.h>

@interface NSURLRequest (AllowUntrustedCertificates)

+(void)setAllowAllRequests:(BOOL)allowRequests;
@end
